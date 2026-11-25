import React from 'react';
import { Play, Pause, RotateCcw, Moon, Sun, Search } from 'lucide-react';

export type TabKey = 'overview' | 'inspector' | 'benchmark' | 'features' | 'policy' | 'telemetry';

interface HeaderProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isStreaming: boolean;
  onToggleStream: () => void;
  onResetStream: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  alertCount: number;
  pps: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isStreaming,
  onToggleStream,
  onResetStream,
  theme,
  onToggleTheme,
  onOpenSearch,
  alertCount,
  pps,
}) => {
  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'inspector', label: 'Flow Inspector & Lab', badge: alertCount },
    { key: 'benchmark', label: 'Track A / B Benchmark' },
    { key: 'features', label: 'Features (49)' },
    { key: 'policy', label: 'Policy & Tuning' },
    { key: 'telemetry', label: 'Raw Telemetry' },
  ];

  return (
    <header className="border-b border-line-hairline bg-canvas sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-sm tracking-tight text-ink-primary">NetSentinel</span>
            <span className="w-1.5 h-1.5 rounded-full bg-alert-ok shrink-0" title="Engine Online" />
          </div>

          <nav className="flex items-center gap-1 shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onSelectTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-ink-primary text-ink-inverted'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-canvas-subtle'
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`ml-1.5 font-mono text-[10px] ${
                        isActive ? 'text-ink-inverted' : 'text-alert-error font-semibold'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Throughput */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-ink-muted">
            <span>Throughput:</span>
            <span className="text-ink-primary tabular-nums font-medium">{pps.toLocaleString()} p/s</span>
          </div>

          {/* Stream Play/Pause */}
          <div className="flex items-center border border-line-hairline rounded">
            <button
              onClick={onToggleStream}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors ${
                isStreaming ? 'text-accent hover:bg-canvas-subtle' : 'text-ink-secondary hover:text-ink-primary'
              }`}
              title={isStreaming ? "Pause real-time stream" : "Start real-time stream"}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isStreaming ? 'Live' : 'Paused'}</span>
            </button>
            <button
              onClick={onResetStream}
              className="p-1 border-l border-line-hairline text-ink-muted hover:text-ink-primary hover:bg-canvas-subtle"
              title="Reset stream buffer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-line-hairline rounded text-ink-secondary hover:text-ink-primary hover:border-line-subtle"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono text-[11px] text-ink-muted">/</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-ink-secondary hover:text-ink-primary rounded border border-line-hairline"
            title={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
