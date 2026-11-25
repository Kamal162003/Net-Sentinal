import React from 'react';
import { EXECUTIVE_METRICS, TRACK_B_FRIDAY_PER_CLASS } from '../data/metricsData';

export const BenchmarkView: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-line-hairline pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
          Model Evaluation & Temporal Drift Benchmark
        </h1>
        <p className="text-xs text-ink-secondary mt-0.5 max-w-3xl">
          Detailed comparison between Track A (Random Stratified Split — 15 Known Classes) and Track B (Unseen Friday Temporal Holdout — Zero-Day Generalization).
        </p>
      </div>

      {/* Narrative Section: The Core Experiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-line-hairline rounded p-5 space-y-2 bg-canvas-subtle">
          <div className="text-xs font-mono text-ink-muted uppercase">Track A Setup</div>
          <h2 className="text-sm font-semibold text-ink-primary">Stratified Evaluation (Known Attacks)</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Standard 80/20 stratified split across Monday through Friday data. Both Random Forest and XGBoost achieve near-perfect discrimination (&gt;99.6% F1) because attack distributions in test mirror training sets identically.
          </p>
          <div className="pt-2 text-xs font-mono text-ink-primary">
            XGBoost Multiclass: <span className="font-semibold text-alert-ok">99.88% F1</span> &bull; 99.99% ROC-AUC
          </div>
        </div>

        <div className="border border-line-hairline rounded p-5 space-y-2 bg-canvas-subtle">
          <div className="text-xs font-mono text-ink-muted uppercase">Track B Setup</div>
          <h2 className="text-sm font-semibold text-ink-primary">Temporal Holdout (Zero-Day Attacks)</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Trained exclusively on Monday–Thursday traffic; tested strictly on unseen Friday traffic (DDoS LOIC, PortScan, Ares Botnet). Supervised XGBoost recall collapses from 99.9% to <strong>0.21%</strong>, demonstrating vulnerability to signature shifts.
          </p>
          <div className="pt-2 text-xs font-mono text-ink-primary">
            Hybrid Autoencoder: <span className="font-semibold text-accent">35.73% F1</span> (+167x gain on supervised)
          </div>
        </div>
      </div>

      {/* Friday Per-Class Breakdown Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Track B (Friday Holdout) — Per-Attack Detection Breakdown
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Demonstrates how unsupervised latent space reconstruction detects LOIC DDoS traffic that bypassed supervised classifiers.
          </p>
        </div>

        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal">Model</th>
                <th className="py-2.5 px-4 font-normal text-right">BENIGN FPR (Lower is Better)</th>
                <th className="py-2.5 px-4 font-normal text-right">DDoS Recall</th>
                <th className="py-2.5 px-4 font-normal text-right">PortScan Recall</th>
                <th className="py-2.5 px-4 font-normal text-right">Bot Recall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums">
              {TRACK_B_FRIDAY_PER_CLASS.map((row, i) => {
                const isBest = row.model.includes('Hybrid_XGB_Autoencoder');
                return (
                  <tr key={i} className={`hover:bg-canvas-subtle transition-colors ${isBest ? 'bg-canvas-subtle font-medium' : ''}`}>
                    <td className="py-2.5 px-4 font-sans text-ink-primary">
                      {row.model}
                      {isBest && <span className="ml-2 text-[10px] text-accent uppercase font-mono">(Recommended)</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right text-ink-secondary">{row.benignFpr}</td>
                    <td className={`py-2.5 px-4 text-right ${parseFloat(row.ddosRecall) > 50 ? 'text-alert-ok font-semibold' : 'text-ink-secondary'}`}>
                      {row.ddosRecall}
                    </td>
                    <td className="py-2.5 px-4 text-right text-ink-secondary">{row.portscanRecall}</td>
                    <td className="py-2.5 px-4 text-right text-ink-secondary">{row.botRecall}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Benchmark Metrics */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          All Evaluated Architectures (Executive Table)
        </h2>

        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal">Evaluation Track</th>
                <th className="py-2.5 px-4 font-normal">Model Architecture</th>
                <th className="py-2.5 px-4 font-normal text-right">Precision</th>
                <th className="py-2.5 px-4 font-normal text-right">Recall</th>
                <th className="py-2.5 px-4 font-normal text-right">F1</th>
                <th className="py-2.5 px-4 font-normal text-right">ROC-AUC</th>
                <th className="py-2.5 px-4 font-normal text-right">PR-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums">
              {EXECUTIVE_METRICS.map((m, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-4 font-sans text-ink-secondary">{m.track}</td>
                  <td className="py-2.5 px-4 text-ink-primary font-medium">{m.model}</td>
                  <td className="py-2.5 px-4 text-right">{(m.precision * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right">{(m.recall * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right font-medium text-ink-primary">{(m.f1 * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right text-ink-muted">{(m.rocAuc * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right text-ink-muted">{(m.prAuc * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
