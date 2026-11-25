import React, { useState, useMemo } from 'react';
import { FEATURES_LIST, FEATURE_SELECTION_SUMMARY } from '../data/metricsData';
import { Search } from 'lucide-react';

export const FeaturesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(FEATURES_LIST.map(f => f.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredFeatures = useMemo(() => {
    return FEATURES_LIST.filter(f => {
      if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-line-hairline pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-ink-primary">
          Feature Intelligence & Selection Pipeline
        </h1>
        <p className="text-xs text-ink-secondary mt-0.5 max-w-3xl">
          Automated dimensionality reduction reduced 78 raw CIC-IDS2017 flow statistics down to 49 optimal, uncorrelated features.
        </p>
      </div>

      {/* Feature Funnel Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-1">
          <div className="text-[11px] text-ink-muted uppercase">Initial CIC-IDS2017</div>
          <div className="text-2xl font-semibold text-ink-primary tabular-nums">78</div>
          <div className="text-ink-secondary text-[11px]">Raw flow metrics</div>
        </div>
        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-1">
          <div className="text-[11px] text-ink-muted uppercase">Zero-Variance Dropped</div>
          <div className="text-2xl font-semibold text-ink-primary tabular-nums">8</div>
          <div className="text-ink-secondary text-[11px]">Constant/zero across all traffic</div>
        </div>
        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-1">
          <div className="text-[11px] text-ink-muted uppercase">Collinear Dropped</div>
          <div className="text-2xl font-semibold text-ink-primary tabular-nums">21</div>
          <div className="text-ink-secondary text-[11px]">Pearson |r| &gt; 0.98 threshold</div>
        </div>
        <div className="border border-line-hairline rounded p-4 bg-canvas-subtle space-y-1">
          <div className="text-[11px] text-ink-muted uppercase">Selected Final Model</div>
          <div className="text-2xl font-semibold text-accent tabular-nums">49</div>
          <div className="text-ink-secondary text-[11px]">Retained for inference</div>
        </div>
      </div>

      {/* High-Correlation Sample Table */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          High-Correlation Pruning Examples (|r| &ge; 0.98)
        </h2>
        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2 px-4 font-normal">Retained Feature</th>
                <th className="py-2 px-4 font-normal">Dropped Redundant Collinear</th>
                <th className="py-2 px-4 font-normal text-right">Absolute Correlation |r|</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline font-mono tabular-nums text-xs">
              {FEATURE_SELECTION_SUMMARY.highCorrPairsSample.map((pair, idx) => (
                <tr key={idx} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2 px-4 text-ink-primary font-medium">{pair.kept}</td>
                  <td className="py-2 px-4 text-ink-muted line-through">{pair.dropped}</td>
                  <td className="py-2 px-4 text-right text-ink-secondary">{pair.corr.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected 49 Features Table with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'border-ink-primary bg-ink-primary text-ink-inverted font-medium'
                    : 'border-line-hairline hover:border-line-subtle text-ink-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Filter 49 features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-canvas-subtle border border-line-hairline rounded pl-8 pr-3 py-1.5 text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-line-subtle font-mono"
            />
          </div>
        </div>

        <div className="border border-line-hairline rounded overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line-hairline bg-canvas-subtle text-ink-muted font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal">Feature Name</th>
                <th className="py-2.5 px-4 font-normal">Category</th>
                <th className="py-2.5 px-4 font-normal text-right">Importance</th>
                <th className="py-2.5 px-4 font-normal">Description</th>
                <th className="py-2.5 px-4 font-normal text-right">Benign Sample</th>
                <th className="py-2.5 px-4 font-normal text-right">Attack Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-hairline text-xs font-mono tabular-nums">
              {filteredFeatures.map((f, i) => (
                <tr key={i} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-2.5 px-4 font-medium text-ink-primary">{f.name}</td>
                  <td className="py-2.5 px-4 text-ink-secondary font-sans">{f.category}</td>
                  <td className="py-2.5 px-4 text-right text-ink-primary font-semibold">
                    {(f.importance * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-4 text-ink-secondary font-sans max-w-xs truncate">
                    {f.description}
                  </td>
                  <td className="py-2.5 px-4 text-right text-ink-muted">{f.sampleBenignVal}</td>
                  <td className="py-2.5 px-4 text-right text-alert-error font-medium">{f.sampleAttackVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
