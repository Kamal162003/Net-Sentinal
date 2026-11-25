import React, { useState, useEffect } from 'react';
import { TabKey } from './Header';
import { FEATURES_LIST, EXECUTIVE_METRICS } from '../data/metricsData';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabKey) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const results: { title: string; subtitle: string; tab: TabKey }[] = [];

  if (q) {
    if ('overview command center'.includes(q)) {
      results.push({ title: 'Overview', subtitle: 'View real-time telemetry metrics and architectural summary', tab: 'overview' });
    }
    if ('inspector flow lab packet tester'.includes(q)) {
      results.push({ title: 'Flow Inspector & Lab', subtitle: 'Live flow table and interactive inference tester', tab: 'inspector' });
    }
    if ('benchmark drift models track a track b friday'.includes(q)) {
      results.push({ title: 'Track A / B Benchmark', subtitle: 'Stratified vs. Temporal holdout comparative evaluation', tab: 'benchmark' });
    }
    if ('features selection pipeline 49 importance'.includes(q)) {
      results.push({ title: 'Features (49)', subtitle: 'Dimensionally reduced feature list & importance', tab: 'features' });
    }
    if ('policy threshold tuning tau_ae tau_sup'.includes(q)) {
      results.push({ title: 'Policy & Tuning', subtitle: 'Adjust calibration cutoffs and severity routing', tab: 'policy' });
    }

    FEATURES_LIST.forEach(f => {
      if (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) {
        results.push({
          title: f.name,
          subtitle: `${f.category} — Importance: ${(f.importance * 100).toFixed(1)}%`,
          tab: 'features'
        });
      }
    });

    EXECUTIVE_METRICS.forEach(m => {
      if (m.model.toLowerCase().includes(q) || m.track.toLowerCase().includes(q)) {
        results.push({
          title: m.model,
          subtitle: `${m.track} — F1: ${(m.f1 * 100).toFixed(2)}%`,
          tab: 'benchmark'
        });
      }
    });
  }

  const handleSelect = (tab: TabKey) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-canvas border border-line-hairline rounded overflow-hidden z-10">
        <div className="flex items-center px-3 border-b border-line-hairline">
          <Search className="w-4 h-4 text-ink-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Type a feature, model, or view name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-3 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none font-mono"
          />
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 text-xs">
          {!q ? (
            <div className="p-4 text-center text-ink-muted font-mono">
              Search by feature (e.g. <code>Port</code>), model (e.g. <code>XGBoost</code>), or view.
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-ink-muted font-mono">
              No results for "{query}".
            </div>
          ) : (
            results.slice(0, 7).map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item.tab)}
                className="w-full text-left p-2 rounded hover:bg-canvas-subtle transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-ink-primary">{item.title}</div>
                  <div className="text-[11px] text-ink-secondary truncate">{item.subtitle}</div>
                </div>
                <span className="font-mono text-[10px] text-ink-muted uppercase border border-line-hairline px-1 rounded">
                  {item.tab}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
