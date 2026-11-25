import React, { useState } from 'react';
import { EXECUTIVE_METRICS, TRACK_B_FULL_METRICS } from '../data/metricsData';
import { INITIAL_FLOWS } from '../data/mockFlows';
import { Download } from 'lucide-react';

export const TelemetryView: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<'inference' | 'executive' | 'track_b'>('inference');

  const handleDownloadCsv = () => {
    let csvContent = "";
    let filename = "";

    if (selectedDataset === 'inference') {
      filename = "inference_demo_results.csv";
      csvContent = "True_Label,Predicted_Label,Attack_Probability,Supervised_Prob,Anomaly_Score_MSE,Alert_Severity,Detection_Trigger\n" +
        INITIAL_FLOWS.map(f => `${f.trueLabel},${f.predictedLabel},${f.attackProbability},${f.supervisedProb},${f.anomalyScoreMse},${f.severity},${f.trigger}`).join("\n");
    } else if (selectedDataset === 'executive') {
      filename = "executive_summary.csv";
      csvContent = "Track,Model,Precision,Recall,F1,ROC_AUC,PR_AUC\n" +
        EXECUTIVE_METRICS.map(m => `"${m.track}",${m.model},${m.precision},${m.recall},${m.f1},${m.rocAuc},${m.prAuc}`).join("\n");
    } else {
      filename = "track_b_metrics.csv";
      csvContent = "Model,Split,Precision,Recall,F1,FPR,ROC_AUC,PR_AUC\n" +
        TRACK_B_FULL_METRICS.map(m => `${m.model},${m.split},${m.precision},${m.recall},${m.f1},${m.fpr},${m.rocAuc},${m.prAuc}`).join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-line-hairline pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
            Raw Telemetry & Evaluation Artifacts
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5 max-w-2xl">
            Direct tabular inspector for serialized training runs, inference logs, and benchmark summaries.
          </p>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line-hairline hover:border-line-subtle rounded text-ink-primary transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </button>
      </div>

      {/* Dataset Picker */}
      <div className="flex items-center gap-1 border border-line-hairline rounded p-0.5 w-fit">
        <button
          onClick={() => setSelectedDataset('inference')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            selectedDataset === 'inference'
              ? 'bg-ink-primary text-ink-inverted font-medium'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          inference_demo_results.csv
        </button>
        <button
          onClick={() => setSelectedDataset('executive')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            selectedDataset === 'executive'
              ? 'bg-ink-primary text-ink-inverted font-medium'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          executive_summary.csv
        </button>
        <button
          onClick={() => setSelectedDataset('track_b')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            selectedDataset === 'track_b'
              ? 'bg-ink-primary text-ink-inverted font-medium'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          track_b_metrics.csv
        </button>
      </div>

      {/* Table Content */}
      <div className="border border-line-hairline rounded overflow-hidden">
        {selectedDataset === 'inference' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-3 font-normal">True Label</th>
                <th className="py-2.5 px-3 font-normal">Predicted</th>
                <th className="py-2.5 px-3 font-normal text-right">Hybrid Prob</th>
                <th className="py-2.5 px-3 font-normal text-right">Supervised Prob</th>
                <th className="py-2.5 px-3 font-normal text-right">AE MSE</th>
                <th className="py-2.5 px-3 font-normal text-right">Alert Severity</th>
                <th className="py-2.5 px-3 font-normal">Detection Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums text-xs">
              {INITIAL_FLOWS.map((f, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-3 text-ink-primary font-sans">{f.trueLabel}</td>
                  <td className="py-2.5 px-3">
                    <span className={f.predictedLabel === 'ATTACK' ? 'text-alert-error font-medium' : 'text-alert-ok font-medium'}>
                      {f.predictedLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-secondary">{f.attackProbability.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-secondary">{f.supervisedProb.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-secondary">{f.anomalyScoreMse.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    <span className={
                      f.severity === 'CRITICAL' ? 'text-alert-error' :
                      f.severity === 'HIGH' ? 'text-alert-warn' : 'text-alert-ok'
                    }>
                      {f.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted">{f.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedDataset === 'executive' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-3 font-normal">Track</th>
                <th className="py-2.5 px-3 font-normal">Model</th>
                <th className="py-2.5 px-3 font-normal text-right">Precision</th>
                <th className="py-2.5 px-3 font-normal text-right">Recall</th>
                <th className="py-2.5 px-3 font-normal text-right">F1</th>
                <th className="py-2.5 px-3 font-normal text-right">ROC_AUC</th>
                <th className="py-2.5 px-3 font-normal text-right">PR_AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums text-xs">
              {EXECUTIVE_METRICS.map((m, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-3 text-ink-secondary font-sans">{m.track}</td>
                  <td className="py-2.5 px-3 text-ink-primary font-medium">{m.model}</td>
                  <td className="py-2.5 px-3 text-right">{m.precision.toFixed(5)}</td>
                  <td className="py-2.5 px-3 text-right">{m.recall.toFixed(5)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-ink-primary">{m.f1.toFixed(5)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-muted">{m.rocAuc.toFixed(5)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-muted">{m.prAuc.toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedDataset === 'track_b' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-3 font-normal">Model</th>
                <th className="py-2.5 px-3 font-normal">Split</th>
                <th className="py-2.5 px-3 font-normal text-right">Precision</th>
                <th className="py-2.5 px-3 font-normal text-right">Recall</th>
                <th className="py-2.5 px-3 font-normal text-right">F1</th>
                <th className="py-2.5 px-3 font-normal text-right">FPR</th>
                <th className="py-2.5 px-3 font-normal text-right">ROC_AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums text-xs">
              {TRACK_B_FULL_METRICS.map((m, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-3 text-ink-primary font-medium">{m.model}</td>
                  <td className="py-2.5 px-3 text-ink-muted">{m.split}</td>
                  <td className="py-2.5 px-3 text-right">{m.precision.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-ink-primary">{m.recall.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right">{m.f1.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-muted">{m.fpr.toFixed(5)}</td>
                  <td className="py-2.5 px-3 text-right text-ink-muted">{m.rocAuc.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
