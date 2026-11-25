import React, { useState, useMemo } from 'react';
import { FlowRecord } from '../types';
import { LAB_PRESETS } from '../data/mockFlows';
import { THRESHOLD_CONFIG } from '../data/metricsData';
import { Search, ChevronDown, ChevronUp, Plus, ArrowUpRight } from 'lucide-react';

interface InspectorViewProps {
  flows: FlowRecord[];
  onInjectFlow: (flow: FlowRecord) => void;
}

export const InspectorView: React.FC<InspectorViewProps> = ({
  flows,
  onInjectFlow,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Manual Tester State
  const [selectedPresetId, setSelectedPresetId] = useState('ddos_friday');
  const [customPort, setCustomPort] = useState(80);
  const [customFwdPackets, setCustomFwdPackets] = useState(11200);
  const [customDuration, setCustomDuration] = useState(92400000);
  const [customSupProb, setCustomSupProb] = useState(0.02);
  const [customAeMse, setCustomAeMse] = useState(0.512);

  const selectedPreset = LAB_PRESETS.find(p => p.id === selectedPresetId) || LAB_PRESETS[0];

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const p = LAB_PRESETS.find(item => item.id === id);
    if (p) {
      setCustomPort(p.dstPort);
      setCustomFwdPackets(p.fwdPackets);
      setCustomDuration(p.duration);
      setCustomSupProb(p.supProb);
      setCustomAeMse(p.aeMse);
    }
  };

  // Inference Math (from Colab notebook Cell 18)
  const tauAe = THRESHOLD_CONFIG.thresholds.tauAe;
  const aeScale = THRESHOLD_CONFIG.thresholds.aeScale;
  const clipBound = THRESHOLD_CONFIG.thresholds.clipBound;

  const rawDelta = (customAeMse - tauAe) / aeScale;
  const clippedDelta = Math.max(-clipBound, Math.min(clipBound, rawDelta));
  const aeProb = 1 / (1 + Math.exp(-clippedDelta));
  const hybridProb = 0.5 * customSupProb + 0.5 * aeProb;

  const isCritical = hybridProb >= 0.90 || (customSupProb >= 0.85 && customAeMse >= 2 * tauAe);
  const isHigh = !isCritical && hybridProb >= 0.75;
  const isMedium = !isCritical && !isHigh && hybridProb >= 0.50;
  const calculatedSeverity = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : isMedium ? 'MEDIUM' : 'LOW';

  const triggerType = (customSupProb >= 0.5 && customAeMse >= tauAe)
    ? 'Supervised + Anomaly'
    : customSupProb >= 0.5
    ? 'Known Signature'
    : customAeMse >= tauAe
    ? 'Zero-Day Anomaly (AE Triggered)'
    : 'Normal Baseline';

  const handleInjectCurrent = () => {
    const newFlow: FlowRecord = {
      id: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 90 + 10),
      srcIp: customSupProb > 0.5 || customAeMse > tauAe ? "205.174.165.73" : "192.168.10.15",
      dstIp: "192.168.10.50",
      dstPort: customPort,
      protocol: "TCP",
      flowDuration: customDuration,
      totalFwdPackets: customFwdPackets,
      flowBytesPerSec: Math.floor(customFwdPackets * 1800),
      flowPacketsPerSec: Math.floor((customFwdPackets / (customDuration / 1000000)) * 10) / 10,
      trueLabel: selectedPreset.expectedLabel,
      predictedLabel: hybridProb >= 0.50 ? 'ATTACK' : 'BENIGN',
      attackType: selectedPreset.name,
      attackProbability: Math.round(hybridProb * 10000) / 10000,
      supervisedProb: customSupProb,
      anomalyScoreMse: customAeMse,
      severity: calculatedSeverity,
      trigger: triggerType,
      activeMean: 0,
      packetLengthMean: 32.0
    };
    onInjectFlow(newFlow);
  };

  const filteredFlows = useMemo(() => {
    return flows.filter((f) => {
      if (activeFilter !== 'ALL' && f.severity !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.id.toLowerCase().includes(q) ||
          f.srcIp.toLowerCase().includes(q) ||
          f.dstPort.toString().includes(q) ||
          f.attackType.toLowerCase().includes(q) ||
          f.trigger.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [flows, activeFilter, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="border-b border-line-hairline pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
            Flow Inspector & Inference Lab
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Real-time packet inspection buffer paired with an interactive 49-feature hybrid scoring simulator.
          </p>
        </div>
        <div className="text-xs font-mono text-ink-muted">
          Buffer Size: <span className="text-ink-primary font-medium">{flows.length} flows</span>
        </div>
      </div>

      {/* Section 1: Interactive Inference Lab */}
      <div className="border border-line-hairline rounded p-5 bg-canvas-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line-hairline">
          <div>
            <h2 className="text-sm font-semibold text-ink-primary">
              Interactive Hybrid Scoring Simulator
            </h2>
            <p className="text-xs text-ink-secondary">
              Test how the dual-engine policy evaluates supervised probability vs. autoencoder latent reconstruction MSE.
            </p>
          </div>
          <button
            onClick={handleInjectCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-ink-primary text-ink-inverted rounded hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Inject Simulated Flow
          </button>
        </div>

        {/* Preset Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-ink-muted uppercase">Select Traffic Preset</label>
          <div className="flex flex-wrap gap-1.5">
            {LAB_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  selectedPresetId === p.id
                    ? 'border-ink-primary bg-ink-primary text-ink-inverted font-medium'
                    : 'border-line-hairline hover:border-line-subtle text-ink-secondary'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-secondary">Supervised Prob (p_sup)</span>
              <span className="text-ink-primary font-medium tabular-nums">{customSupProb.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={customSupProb}
              onChange={(e) => setCustomSupProb(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="text-[11px] text-ink-muted">
              XGBoost 15-class decision boundary: &tau;_sup = 0.50
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-secondary">Autoencoder MSE (anomaly_score)</span>
              <span className="text-ink-primary font-medium tabular-nums">{customAeMse.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.005"
              value={customAeMse}
              onChange={(e) => setCustomAeMse(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="text-[11px] text-ink-muted">
              Latent cutoff: &tau;_ae = 0.2479 (98th percentile benign FPR=2.0%)
            </div>
          </div>
        </div>

        {/* Live Calculation Output Strip */}
        <div className="border border-line-hairline rounded p-3.5 bg-canvas font-mono text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-ink-muted">Calibrated Hybrid Prob</div>
            <div className="text-base font-semibold text-ink-primary tabular-nums mt-0.5">
              {(hybridProb * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-muted">Classification</div>
            <div className={`text-base font-semibold mt-0.5 ${hybridProb >= 0.50 ? 'text-alert-error' : 'text-alert-ok'}`}>
              {hybridProb >= 0.50 ? 'ATTACK' : 'BENIGN'}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-muted">Trigger Reason</div>
            <div className="text-xs text-ink-primary font-medium mt-1 truncate">
              {triggerType}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-muted">Alert Severity</div>
            <div className={`text-base font-semibold mt-0.5 ${
              calculatedSeverity === 'CRITICAL' ? 'text-alert-error' :
              calculatedSeverity === 'HIGH' ? 'text-alert-warn' : 'text-alert-ok'
            }`}>
              {calculatedSeverity}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Real-Time Flow Telemetry Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Severity Filters */}
          <div className="flex items-center gap-1 border border-line-hairline rounded p-0.5">
            {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeFilter === filter
                    ? 'bg-ink-primary text-ink-inverted font-medium'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Filter by IP, port, or attack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-canvas-subtle border border-line-hairline rounded pl-8 pr-3 py-1.5 text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-line-subtle font-mono"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredFlows.length === 0 ? (
          <div className="border border-line-hairline rounded p-12 text-center space-y-3">
            <div className="text-sm font-medium text-ink-primary">No matching flows</div>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto">
              No buffered telemetry matches "{searchQuery}" under {activeFilter} severity filter.
            </p>
            <button
              onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }}
              className="text-xs text-accent hover:underline font-mono"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="border border-line-hairline rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                  <th className="py-2.5 px-3 font-normal">Flow ID</th>
                  <th className="py-2.5 px-3 font-normal">Time</th>
                  <th className="py-2.5 px-3 font-normal">Source &rarr; Dest</th>
                  <th className="py-2.5 px-3 font-normal">Attack Vector</th>
                  <th className="py-2.5 px-3 font-normal text-right">p_sup</th>
                  <th className="py-2.5 px-3 font-normal text-right">AE MSE</th>
                  <th className="py-2.5 px-3 font-normal text-right">Severity</th>
                  <th className="py-2.5 px-3 font-normal text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-hairline font-mono tabular-nums">
                {filteredFlows.map((flow) => {
                  const isExpanded = expandedId === flow.id;
                  return (
                    <React.Fragment key={flow.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : flow.id)}
                        className="hover:bg-canvas-subtle cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-3 text-ink-muted">{flow.id}</td>
                        <td className="py-2.5 px-3 text-ink-secondary">{flow.timestamp}</td>
                        <td className="py-2.5 px-3 text-ink-primary font-medium">
                          {flow.srcIp} &rarr; :{flow.dstPort}
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className={flow.predictedLabel === 'ATTACK' ? 'text-alert-error font-medium' : 'text-ink-secondary'}>
                            {flow.attackType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-ink-secondary">
                          {flow.supervisedProb.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-ink-secondary">
                          {flow.anomalyScoreMse.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium">
                          <span className={
                            flow.severity === 'CRITICAL' ? 'text-alert-error' :
                            flow.severity === 'HIGH' ? 'text-alert-warn' : 'text-alert-ok'
                          }>
                            {flow.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-ink-muted">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 mx-auto" /> : <ChevronDown className="w-3.5 h-3.5 mx-auto" />}
                        </td>
                      </tr>

                      {/* Expanded Row Detail Accordion */}
                      {isExpanded && (
                        <tr className="bg-canvas-subtle">
                          <td colSpan={8} className="p-4 border-b border-line-hairline">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-[11px] text-ink-muted block">Flow Duration</span>
                                <span className="text-ink-primary font-medium">{(flow.flowDuration / 1000).toLocaleString()} ms</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-ink-muted block">Forward Packets</span>
                                <span className="text-ink-primary font-medium">{flow.totalFwdPackets.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-ink-muted block">Rate (Packets/s)</span>
                                <span className="text-ink-primary font-medium">{flow.flowPacketsPerSec.toLocaleString()} pps</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-ink-muted block">Detection Trigger</span>
                                <span className="text-ink-primary font-medium">{flow.trigger}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
