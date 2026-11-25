import React, { useState } from 'react';
import { THRESHOLD_CONFIG } from '../data/metricsData';
import { RotateCcw } from 'lucide-react';

export const PolicyView: React.FC = () => {
  const [tauSup, setTauSup] = useState(THRESHOLD_CONFIG.thresholds.tauSup);
  const [tauAe, setTauAe] = useState(THRESHOLD_CONFIG.thresholds.tauAe);
  const [aeScale, setAeScale] = useState(THRESHOLD_CONFIG.thresholds.aeScale);

  const handleReset = () => {
    setTauSup(THRESHOLD_CONFIG.thresholds.tauSup);
    setTauAe(THRESHOLD_CONFIG.thresholds.tauAe);
    setAeScale(THRESHOLD_CONFIG.thresholds.aeScale);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-line-hairline pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
            Threshold Calibration & Operational Policy
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5 max-w-3xl">
            Tuned on Monday–Thursday validation traffic at the 98th percentile of benign traffic to enforce a strict false positive rate &le; 2.0%.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-line-hairline rounded hover:border-line-subtle text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Threshold Tuner Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-ink-muted uppercase text-[11px]">Supervised Cutoff (&tau;_sup)</span>
            <span className="text-sm font-semibold text-ink-primary tabular-nums">{tauSup.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={tauSup}
            onChange={(e) => setTauSup(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
            Minimum XGBoost signature probability to trigger supervised attack classification.
          </p>
        </div>

        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-ink-muted uppercase text-[11px]">Autoencoder Cutoff (&tau;_ae)</span>
            <span className="text-sm font-semibold text-ink-primary tabular-nums">{tauAe.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.01"
            value={tauAe}
            onChange={(e) => setTauAe(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
            Latent reconstruction MSE threshold. Calibrated to limit benign false positives to 2.0%.
          </p>
        </div>

        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-ink-muted uppercase text-[11px]">Sigmoid AE Scale</span>
            <span className="text-sm font-semibold text-ink-primary tabular-nums">{aeScale.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.3"
            step="0.01"
            value={aeScale}
            onChange={(e) => setAeScale(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
            Scaling constant denominator in logistic curve: sigmoid((mse - &tau;_ae) / scale).
          </p>
        </div>
      </div>

      {/* Operational Severity Policy Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Production Alert Severity Policy Matrix
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Automated SDN actions triggered by the dual-engine alert classification.
          </p>
        </div>

        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal">Level</th>
                <th className="py-2.5 px-4 font-normal">Evaluation Rule Logic</th>
                <th className="py-2.5 px-4 font-normal">Traffic Type</th>
                <th className="py-2.5 px-4 font-normal">Automated Response Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline text-xs">
              <tr className="hover:bg-canvas-subtle transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-alert-ok">LOW</td>
                <td className="py-3 px-4 font-mono text-ink-secondary">hybrid_prob &lt; 0.50</td>
                <td className="py-3 px-4 text-ink-primary">Normal baseline traffic</td>
                <td className="py-3 px-4 text-ink-muted font-mono text-[11px]">Allow; pass to flow telemetry cache</td>
              </tr>
              <tr className="hover:bg-canvas-subtle transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-ink-primary">MEDIUM</td>
                <td className="py-3 px-4 font-mono text-ink-secondary">0.50 &le; hybrid_prob &lt; 0.75</td>
                <td className="py-3 px-4 text-ink-primary">Suspicious anomaly or weak signature</td>
                <td className="py-3 px-4 text-ink-muted font-mono text-[11px]">Log flow metrics; sample 10% packet payloads</td>
              </tr>
              <tr className="hover:bg-canvas-subtle transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-alert-warn">HIGH</td>
                <td className="py-3 px-4 font-mono text-ink-secondary">0.75 &le; hybrid_prob &lt; 0.90</td>
                <td className="py-3 px-4 text-ink-primary">High anomaly score or verified signature</td>
                <td className="py-3 px-4 text-ink-muted font-mono text-[11px]">Rate-limit source IP; alert SOC analyst</td>
              </tr>
              <tr className="hover:bg-canvas-subtle transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-alert-error">CRITICAL</td>
                <td className="py-3 px-4 font-mono text-ink-secondary">hybrid_prob &ge; 0.90 or (p_sup &ge; 0.85 and mse &ge; 2*&tau;_ae)</td>
                <td className="py-3 px-4 text-ink-primary">Confirmed flood attack or severe zero-day</td>
                <td className="py-3 px-4 text-ink-muted font-mono text-[11px]">Immediate SDN port isolation &amp; null-route IP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
