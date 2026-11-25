import React, { useState, useEffect } from 'react';
import { Header, TabKey } from './components/Header';
import { OverviewView } from './views/OverviewView';
import { InspectorView } from './views/InspectorView';
import { BenchmarkView } from './views/BenchmarkView';
import { FeaturesView } from './views/FeaturesView';
import { PolicyView } from './views/PolicyView';
import { TelemetryView } from './views/TelemetryView';
import { SearchModal } from './components/SearchModal';
import { INITIAL_FLOWS, LAB_PRESETS } from './data/mockFlows';
import { FlowRecord } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [flows, setFlows] = useState<FlowRecord[]>(INITIAL_FLOWS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pps, setPps] = useState(1420);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global key listener for '/' or Cmd/Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time flow simulation stream
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Fluctuate PPS slightly
      setPps(prev => Math.floor(prev + (Math.random() * 80 - 40)));

      // 40% chance of adding a new flow
      if (Math.random() > 0.45) {
        const isAttack = Math.random() < 0.25;
        const preset = isAttack
          ? LAB_PRESETS[Math.floor(Math.random() * (LAB_PRESETS.length - 1)) + 1]
          : LAB_PRESETS[0];

        const newId = `FL-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 90 + 10);

        const newFlow: FlowRecord = {
          id: newId,
          timestamp: timeStr,
          srcIp: isAttack ? "205.174.165.73" : `192.168.10.${Math.floor(Math.random() * 40 + 10)}`,
          dstIp: "192.168.10.50",
          dstPort: preset.dstPort,
          protocol: "TCP",
          flowDuration: preset.duration,
          totalFwdPackets: preset.fwdPackets,
          flowBytesPerSec: preset.bytesSec,
          flowPacketsPerSec: preset.packetsSec,
          trueLabel: preset.expectedLabel,
          predictedLabel: isAttack ? 'ATTACK' : 'BENIGN',
          attackType: preset.name,
          attackProbability: isAttack ? 0.98 : 0.08,
          supervisedProb: preset.supProb,
          anomalyScoreMse: preset.aeMse,
          severity: isAttack ? (preset.supProb >= 0.85 || preset.aeMse > 0.3 ? 'CRITICAL' : 'HIGH') : 'LOW',
          trigger: preset.triggerType,
          activeMean: 0,
          packetLengthMean: 38.0
        };

        setFlows(prev => [newFlow, ...prev.slice(0, 49)]); // Keep buffer capped at 50
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleToggleStream = () => setIsStreaming(prev => !prev);
  const handleResetStream = () => setFlows(INITIAL_FLOWS);
  const handleToggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleInjectFlow = (flow: FlowRecord) => {
    setFlows(prev => [flow, ...prev.slice(0, 49)]);
  };

  const criticalCount = flows.filter(f => f.severity === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex flex-col">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isStreaming={isStreaming}
        onToggleStream={handleToggleStream}
        onResetStream={handleResetStream}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        alertCount={criticalCount}
        pps={pps}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewView
            flows={flows}
            onNavigate={setActiveTab}
            pps={pps}
          />
        )}
        {activeTab === 'inspector' && (
          <InspectorView
            flows={flows}
            onInjectFlow={handleInjectFlow}
          />
        )}
        {activeTab === 'benchmark' && <BenchmarkView />}
        {activeTab === 'features' && <FeaturesView />}
        {activeTab === 'policy' && <PolicyView />}
        {activeTab === 'telemetry' && <TelemetryView />}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-line-hairline py-4 px-4 sm:px-6 text-xs text-ink-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono">
            NetSentinel &bull; CIC-IDS2017 Dual-Engine Pipeline (XGBoost + PyTorch Autoencoder)
          </div>
          <div className="text-[11px] font-mono">
            Monochrome Strict Architecture &bull; Latent &tau;=0.2479
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
};
