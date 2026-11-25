import React from 'react';
import { FlowRecord } from '../types';
import { TabKey } from '../components/Header';
import { EXECUTIVE_METRICS, THRESHOLD_CONFIG } from '../data/metricsData';

interface OverviewViewProps {
  flows: FlowRecord[];
  onNavigate: (tab: TabKey) => void;
  pps: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  flows,
  onNavigate,
  pps,
}) => {
  const criticalAlerts = flows.filter(f => f.severity === 'CRITICAL');
  const normalFlows = flows.filter(f => f.severity === 'LOW');

  return (
    <div className="space-y-12">
      {/* Editorial Header / Summary Statement */}
      <div className="border-b border-line-hairline pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
              Network Intrusion Detection & Telemetry
            </h1>
            <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">
              Industrial dual-engine deployment on CIC-IDS2017. Combines sub-millisecond XGBoost classification for 15 known attack signatures with an unsupervised deep autoencoder for zero-day Friday temporal anomalies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('inspector')}
              className="px-3.5 py-1.5 text-xs font-medium bg-ink-primary text-ink-inverted rounded hover:opacity-90 transition-opacity"
            >
              Inspect Active Flows
            </button>
            <button
              onClick={() => onNavigate('benchmark')}
              className="px-3.5 py-1.5 text-xs font-medium border border-line-hairline hover:border-line-subtle rounded text-ink-primary transition-colors"
            >
              Benchmark Data
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics — Pure Typography & Whitespace */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <div className="text-xs text-ink-muted uppercase tracking-wider font-mono">Stream Throughput</div>
          <div className="text-3xl font-semibold text-ink-primary font-mono tabular-nums tracking-tight">
            {pps.toLocaleString()} <span className="text-xs font-normal text-ink-muted">p/s</span>
          </div>
          <div className="text-xs text-ink-secondary">~14.2 MB/s line rate</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-ink-muted uppercase tracking-wider font-mono">Track A Multiclass F1</div>
          <div className="text-3xl font-semibold text-ink-primary font-mono tabular-nums tracking-tight">
            99.88%
          </div>
          <div className="text-xs text-ink-secondary">15 attack classes (XGBoost)</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-ink-muted uppercase tracking-wider font-mono">Friday Zero-Day Recall</div>
          <div className="text-3xl font-semibold text-ink-primary font-mono tabular-nums tracking-tight">
            35.73%
          </div>
          <div className="text-xs text-ink-secondary">
            Supervised baseline: <span className="text-alert-error font-mono font-medium">0.21%</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-ink-muted uppercase tracking-wider font-mono">Active Critical Alerts</div>
          <div className="text-3xl font-semibold text-alert-error font-mono tabular-nums tracking-tight">
            {criticalAlerts.length}
          </div>
          <div className="text-xs text-ink-secondary">
            {flows.length} total buffered flows
          </div>
        </div>
      </div>

      {/* Core Architectural Finding: Track A vs Track B Contrast */}
      <div className="border border-line-hairline rounded p-5 bg-canvas-subtle">
        <div className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">Core ML Finding</div>
        <h2 className="text-sm font-semibold text-ink-primary mb-1">
          The Supervised Temporal Generalization Gap
        </h2>
        <p className="text-xs text-ink-secondary leading-relaxed max-w-4xl">
          Under random stratified testing (Track A), supervised models achieve near-perfect performance (99.72% binary F1, 99.88% multiclass F1). However, when Friday traffic is held out as an unseen temporal test set (Track B), supervised recall collapses to <strong>0.21%</strong> because Friday attacks exhibit different packet sizes and timing dynamics. The unsupervised deep autoencoder rescues recall to <strong>35.73%</strong> (and <strong>60.18%</strong> on DDoS) by learning normal latent manifolds rather than memorizing signatures.
        </p>
      </div>

      {/* Executive Summary Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Executive Model Benchmark Summary
          </h2>
          <button
            onClick={() => onNavigate('benchmark')}
            className="text-xs text-accent hover:underline font-mono"
          >
            View full evaluation &rarr;
          </button>
        </div>

        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal">Track / Evaluation Split</th>
                <th className="py-2.5 px-4 font-normal">Model Architecture</th>
                <th className="py-2.5 px-4 font-normal text-right">Precision</th>
                <th className="py-2.5 px-4 font-normal text-right">Recall</th>
                <th className="py-2.5 px-4 font-normal text-right">F1 Score</th>
                <th className="py-2.5 px-4 font-normal text-right">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums">
              {EXECUTIVE_METRICS.slice(0, 6).map((m, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-4 font-sans text-ink-secondary">{m.track}</td>
                  <td className="py-2.5 px-4 text-ink-primary font-medium">{m.model}</td>
                  <td className="py-2.5 px-4 text-right">{(m.precision * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right">{(m.recall * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-ink-primary">{(m.f1 * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right text-ink-muted">{(m.rocAuc * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Incident Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Recent Telemetry Buffer Feed
          </h2>
          <span className="text-xs text-ink-muted font-mono">{flows.length} flows active</span>
        </div>

        <div className="border border-line-hairline rounded divide-y divide-line-hairline">
          {flows.slice(0, 5).map((f) => (
            <div key={f.id} className="p-3 flex items-center justify-between text-xs hover:bg-canvas-subtle transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-ink-muted w-16">{f.id}</span>
                <span className="font-mono text-ink-secondary">{f.timestamp}</span>
                <span className="font-mono text-ink-primary">{f.srcIp} &rarr; :{f.dstPort}</span>
                <span className="text-ink-secondary font-medium">{f.attackType}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="text-ink-muted">{f.trigger}</span>
                <span className={`font-semibold ${
                  f.severity === 'CRITICAL' ? 'text-alert-error' :
                  f.severity === 'HIGH' ? 'text-alert-warn' : 'text-alert-ok'
                }`}>
                  {f.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
