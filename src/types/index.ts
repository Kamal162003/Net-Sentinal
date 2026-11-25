export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FlowRecord {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP';
  flowDuration: number;
  totalFwdPackets: number;
  flowBytesPerSec: number;
  flowPacketsPerSec: number;
  trueLabel: string;
  predictedLabel: 'BENIGN' | 'ATTACK';
  attackType: string;
  attackProbability: number;
  supervisedProb: number;
  anomalyScoreMse: number;
  severity: SeverityLevel;
  trigger: string;
  activeMean: number;
  packetLengthMean: number;
}

export interface MetricSummary {
  track: string;
  model: string;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  prAuc: number;
  fpr?: number;
}

export interface FeatureMeta {
  name: string;
  importance: number;
  category: string;
  description: string;
  sampleBenignVal: string;
  sampleAttackVal: string;
}
