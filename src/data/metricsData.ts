import { MetricSummary, FeatureMeta } from '../types';

export const THRESHOLD_CONFIG = {
  modelName: "NetSentinel_Hybrid_XGB_Autoencoder_v1",
  featureCount: 49,
  thresholds: {
    tauSup: 0.50,
    tauAe: 0.247958,
    aeScale: 0.103261,
    clipBound: 20.0,
    tunedOn: "Mon-Thu Validation (98th percentile BENIGN FPR=2.0%)"
  },
  severityPolicy: [
    { level: "LOW", rule: "hybrid_prob < 0.50", desc: "Benign normal baseline traffic" },
    { level: "MEDIUM", rule: "0.50 <= hybrid_prob < 0.75", desc: "Weak anomaly or low-confidence signature" },
    { level: "HIGH", rule: "0.75 <= hybrid_prob < 0.90", desc: "Elevated anomaly score or matched signature" },
    { level: "CRITICAL", rule: "hybrid_prob >= 0.90 or (p_sup >= 0.85 and mse >= 2 * tau_ae)", desc: "High confidence signature or severe latent outlier" }
  ]
};

export const EXECUTIVE_METRICS: MetricSummary[] = [
  {
    track: "Track A (Binary Stratified Test)",
    model: "XGBoost_Binary",
    precision: 0.99487,
    recall: 0.99945,
    f1: 0.99716,
    rocAuc: 0.99997,
    prAuc: 0.99988
  },
  {
    track: "Track A (Binary Stratified Test)",
    model: "RandomForest_Binary",
    precision: 0.99499,
    recall: 0.99815,
    f1: 0.99657,
    rocAuc: 0.99995,
    prAuc: 0.99977
  },
  {
    track: "Track A (15-Class Multiclass, Weighted)",
    model: "XGBoost_Multiclass",
    precision: 0.99878,
    recall: 0.99874,
    f1: 0.99875,
    rocAuc: 0.99989,
    prAuc: 0.90427
  },
  {
    track: "Track A (15-Class Multiclass, Weighted)",
    model: "RandomForest_Multiclass",
    precision: 0.99758,
    recall: 0.99587,
    f1: 0.99655,
    rocAuc: 0.98139,
    prAuc: 0.86081
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "Hybrid_XGB_Autoencoder (Recommended)",
    precision: 0.68761,
    recall: 0.35727,
    f1: 0.47022,
    rocAuc: 0.88547,
    prAuc: 0.65462
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "Autoencoder_Only",
    precision: 0.68734,
    recall: 0.35624,
    f1: 0.46926,
    rocAuc: 0.88552,
    prAuc: 0.65470
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "Hybrid_XGB_IsoForest",
    precision: 0.38364,
    recall: 0.11620,
    f1: 0.17837,
    rocAuc: 0.85519,
    prAuc: 0.59930
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "IsoForest_Only",
    precision: 0.38025,
    recall: 0.11438,
    f1: 0.17586,
    rocAuc: 0.85503,
    prAuc: 0.59790
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "RF_Supervised_Only",
    precision: 0.98545,
    recall: 0.05951,
    f1: 0.11225,
    rocAuc: 0.82953,
    prAuc: 0.78959
  },
  {
    track: "Track B (Unseen Friday Temporal Holdout)",
    model: "XGB_Supervised_Only",
    precision: 0.86949,
    recall: 0.00214,
    f1: 0.00427,
    rocAuc: 0.75304,
    prAuc: 0.74270
  }
];

export const TRACK_B_FULL_METRICS = [
  { model: "XGB_Supervised_Only", split: "Friday_Test", precision: 0.8695, recall: 0.0021, f1: 0.0043, fpr: 0.00018, rocAuc: 0.7530, prAuc: 0.7427 },
  { model: "RF_Supervised_Only", split: "Friday_Test", precision: 0.9855, recall: 0.0595, f1: 0.1122, fpr: 0.00048, rocAuc: 0.8295, prAuc: 0.7896 },
  { model: "IsoForest_Only", split: "Friday_Test", precision: 0.3803, recall: 0.1144, f1: 0.1759, fpr: 0.10275, rocAuc: 0.8550, prAuc: 0.5979 },
  { model: "Autoencoder_Only", split: "Friday_Test", precision: 0.6873, recall: 0.3562, f1: 0.4693, fpr: 0.08932, rocAuc: 0.8855, prAuc: 0.6547 },
  { model: "Hybrid_XGB_IsoForest", split: "Friday_Test", precision: 0.3836, recall: 0.1162, f1: 0.1784, fpr: 0.10290, rocAuc: 0.8552, prAuc: 0.5993 },
  { model: "Hybrid_XGB_Autoencoder", split: "Friday_Test", precision: 0.6876, recall: 0.3573, f1: 0.4702, fpr: 0.08947, rocAuc: 0.8855, prAuc: 0.6546 },
  { model: "Anomaly_Fused_AE_IF", split: "Friday_Test", precision: 0.6092, recall: 0.2535, f1: 0.3580, fpr: 0.08962, rocAuc: 0.8802, prAuc: 0.6434 },
  { model: "Hybrid_XGB_AE_IF", split: "Friday_Test", precision: 0.6105, recall: 0.2553, f1: 0.3600, fpr: 0.08977, rocAuc: 0.8801, prAuc: 0.6434 }
];

export const TRACK_B_FRIDAY_PER_CLASS = [
  { model: "XGB_Supervised_Only", benignFpr: "0.018%", ddosRecall: "0.030%", portscanRecall: "0.478%", botRecall: "0.000%" },
  { model: "RF_Supervised_Only", benignFpr: "0.048%", ddosRecall: "5.820%", portscanRecall: "2.140%", botRecall: "0.000%" },
  { model: "IsoForest_Only", benignFpr: "10.275%", ddosRecall: "18.866%", portscanRecall: "0.628%", botRecall: "27.240%" },
  { model: "Autoencoder_Only", benignFpr: "8.932%", ddosRecall: "60.177%", portscanRecall: "1.729%", botRecall: "2.407%" },
  { model: "Hybrid_XGB_IsoForest", benignFpr: "10.290%", ddosRecall: "18.887%", portscanRecall: "1.041%", botRecall: "27.240%" },
  { model: "Hybrid_XGB_Autoencoder", benignFpr: "8.947%", ddosRecall: "60.177%", portscanRecall: "1.979%", botRecall: "2.407%" }
];

export const FEATURE_SELECTION_SUMMARY = {
  initialCount: 78,
  zeroVarianceDropped: [
    "Bwd PSH Flags", "Bwd URG Flags", "Fwd Avg Bytes/Bulk", "Fwd Avg Packets/Bulk",
    "Fwd Avg Bulk Rate", "Bwd Avg Bytes/Bulk", "Bwd Avg Packets/Bulk", "Bwd Avg Bulk Rate"
  ],
  highCorrThreshold: 0.98,
  highCorrPairsSample: [
    { kept: "Total Fwd Packets", dropped: "Total Backward Packets", corr: 0.9991 },
    { kept: "Total Fwd Packets", dropped: "Total Length of Bwd Packets", corr: 0.9970 },
    { kept: "Flow Duration", dropped: "Fwd IAT Total", corr: 0.9985 },
    { kept: "Flow IAT Max", dropped: "Fwd IAT Max", corr: 0.9981 },
    { kept: "Flow Packets/s", dropped: "Fwd Packets/s", corr: 0.9801 },
    { kept: "Max Packet Length", dropped: "Packet Length Std", corr: 0.9841 },
    { kept: "Fwd PSH Flags", dropped: "SYN Flag Count", corr: 1.0000 },
    { kept: "Bwd Header Length", dropped: "Fwd Header Length.1", corr: 1.0000 }
  ],
  finalCount: 49
};

export const FEATURES_LIST: FeatureMeta[] = [
  { name: "Destination Port", importance: 0.168, category: "Volume & Duration", description: "Target port number indicating requested service.", sampleBenignVal: "443", sampleAttackVal: "80" },
  { name: "Flow Duration", importance: 0.114, category: "Volume & Duration", description: "Total duration of bidirectional flow in microseconds.", sampleBenignVal: "21,492 μs", sampleAttackVal: "119,482,019 μs" },
  { name: "Total Length of Fwd Packets", importance: 0.089, category: "Volume & Duration", description: "Sum of payload bytes in forward direction.", sampleBenignVal: "1,248 B", sampleAttackVal: "0 B" },
  { name: "Flow Packets/s", importance: 0.076, category: "Volume & Duration", description: "Packet transfer rate in packets per second.", sampleBenignVal: "232.4 p/s", sampleAttackVal: "8,920.1 p/s" },
  { name: "Flow Bytes/s", importance: 0.072, category: "Volume & Duration", description: "Bandwidth consumption in bytes per second.", sampleBenignVal: "18.4 KB/s", sampleAttackVal: "4.2 MB/s" },
  { name: "Fwd Packet Length Max", importance: 0.065, category: "Packet Statistics", description: "Maximum packet length seen in forward transmission.", sampleBenignVal: "517 B", sampleAttackVal: "0 B" },
  { name: "Packet Length Variance", importance: 0.058, category: "Packet Statistics", description: "Variance of observed packet payload sizes.", sampleBenignVal: "48,291.2", sampleAttackVal: "0.0" },
  { name: "Init_Win_bytes_forward", importance: 0.054, category: "TCP Flags & Windows", description: "TCP initial receive window byte size (forward).", sampleBenignVal: "29,200", sampleAttackVal: "256" },
  { name: "Init_Win_bytes_backward", importance: 0.048, category: "TCP Flags & Windows", description: "TCP initial receive window byte size (backward).", sampleBenignVal: "28,960", sampleAttackVal: "-1" },
  { name: "Flow IAT Mean", importance: 0.044, category: "Inter-Arrival Time (IAT)", description: "Mean time gap between consecutive packets.", sampleBenignVal: "1,240 μs", sampleAttackVal: "12 μs" },
  { name: "Flow IAT Std", importance: 0.041, category: "Inter-Arrival Time (IAT)", description: "Standard deviation of packet inter-arrival time.", sampleBenignVal: "2,490 μs", sampleAttackVal: "2.1 μs" },
  { name: "Fwd Header Length", importance: 0.038, category: "Volume & Duration", description: "Total forward IP and TCP header length.", sampleBenignVal: "120 B", sampleAttackVal: "4,096 B" },
  { name: "PSH Flag Count", importance: 0.035, category: "TCP Flags & Windows", description: "Number of packets with Push flag activated.", sampleBenignVal: "4", sampleAttackVal: "0" },
  { name: "ACK Flag Count", importance: 0.031, category: "TCP Flags & Windows", description: "Number of packets with Acknowledgment flag set.", sampleBenignVal: "12", sampleAttackVal: "0" },
  { name: "Active Mean", importance: 0.027, category: "Subflow & Activity", description: "Mean active burst time before entering idle state.", sampleBenignVal: "0.0", sampleAttackVal: "4,992,110 μs" },
  { name: "Idle Std", importance: 0.024, category: "Subflow & Activity", description: "Standard deviation of idle wait times.", sampleBenignVal: "0.0", sampleAttackVal: "1,200,450 μs" },
  { name: "Bwd Packet Length Mean", importance: 0.021, category: "Packet Statistics", description: "Average packet size returned in backward direction.", sampleBenignVal: "1,420 B", sampleAttackVal: "0 B" },
  { name: "Fwd IAT Min", importance: 0.018, category: "Inter-Arrival Time (IAT)", description: "Minimum forward packet gap duration.", sampleBenignVal: "48 μs", sampleAttackVal: "1 μs" },
  { name: "URG Flag Count", importance: 0.012, category: "TCP Flags & Windows", description: "Number of packets carrying Urgent pointer.", sampleBenignVal: "0", sampleAttackVal: "0" }
];
