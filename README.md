# NetSentinel: Industrial-Grade Network Intrusion Detection System

[![CIC-IDS2017](https://img.shields.io/badge/Dataset-CIC--IDS2017-blue.svg)](https://www.unb.ca/cic/datasets/ids-2017.html)
[![Dual-Engine](https://img.shields.io/badge/Architecture-XGBoost%20%2B%20PyTorch%20Autoencoder-emerald.svg)]()
[![License](https://img.shields.io/badge/License-MIT-gray.svg)]()

> **NetSentinel** is a dual-engine Network Intrusion Detection System (NIDS) trained and evaluated on the **CIC-IDS2017** benchmark. It bridges the critical **supervised temporal generalization gap** by combining sub-millisecond gradient boosted decision trees for known attack signatures with an unsupervised deep neural autoencoder for zero-day anomaly detection.

---

## 🎯 The Core Research Problem: The Generalization Trap

Standard intrusion detection literature evaluates models using random stratified splits (**Track A**), producing near-perfect metrics (>99.7% F1) because test attacks identically mirror training distributions.

However, in realistic production deployments (**Track B**), attack signatures evolve. When trained on **Monday–Thursday** traffic and tested strictly on unseen **Friday** traffic (LOIC DDoS, Stealth PortScans, Ares Botnet):
- **Supervised XGBoost Recall Collapses:** Plunges from **99.95%** down to **0.21%** ($0.03\%$ on LOIC DDoS).
- **NetSentinel Dual-Engine Defense:** Recovers recall to **35.73%** overall (**60.18% on Friday DDoS**) — a **167x improvement** over pure supervised models without training on any Friday attack labels.

---

## 🏗️ Architecture & Pipeline

```
                               Incoming Network Flow (49 Features)
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
        [ Engine 1: Supervised XGBoost ]                     [ Engine 2: Deep Autoencoder ]
         • 15-Class Multiclass Classifier                     • Trained strictly on BENIGN flows
         • Fast Signature Matching                            • Latent Bottleneck: 49→32→16→8→16→32→49
         • Output: p_sup (tau_sup = 0.50)                     • Output: Reconstruction Error (MSE)
                     │                                                     │
                     └──────────────────────────┬──────────────────────────┘
                                                ▼
                                    [ Calibrated Hybrid Fusion ]
                hybrid_prob = 0.5 * p_sup + 0.5 * sigmoid(clip((MSE - tau_ae) / scale))
                                                │
                                                ▼
                                  [ Automated Severity Routing ]
              LOW (<0.50)  │  MEDIUM (0.50-0.75)  │  HIGH (0.75-0.90)  │  CRITICAL (≥0.90)
```

### 1. Feature Engineering Funnel (78 $\to$ 49 Features)
- **Zero-Variance Dropping (8 dropped):** Dropped constant features like `Bwd PSH Flags`, `Bwd URG Flags`, and bulk transmission rates.
- **High Collinearity Pruning (21 dropped):** Filtered redundant pairs with Pearson $|r| \ge 0.98$ (e.g., `Total Fwd Packets` vs `Total Backward Packets` $|r|=0.999$, `Flow Duration` vs `Fwd IAT Total` $|r|=0.998$).
- **Final Set (49 features):** Volume, packet length variance, inter-arrival times (IAT), TCP window sizes, and active/idle metrics.

### 2. Operational Alert Severity Matrix
- **LOW (`hybrid_prob < 0.50`):** Normal baseline traffic; passes to telemetry cache.
- **MEDIUM (`0.50 <= hybrid_prob < 0.75`):** Weak anomaly or low-confidence signature; triggers 10% packet payload sampling.
- **HIGH (`0.75 <= hybrid_prob < 0.90`):** Elevated anomaly score or verified signature; rate-limits source IP.
- **CRITICAL (`hybrid_prob >= 0.90` or `[p_sup >= 0.85 and MSE >= 2*tau_ae]`):** Confirmed flood attack or severe zero-day; triggers automated SDN port isolation.

---

## 📊 Empirical Evaluation Results

### Track A: Stratified 15-Class Benchmark (Known Attacks)
| Model | Accuracy | Weighted F1 | Macro F1 | ROC-AUC | PR-AUC |
|---|---|---|---|---|---|
| **XGBoost Multiclass** | **99.87%** | **99.88%** | **85.74%** | **99.99%** | **90.43%** |
| Random Forest Multiclass | 99.59% | 99.66% | 70.34% | 98.14% | 86.08% |

### Track B: Friday Temporal Holdout (Unseen Zero-Day Attacks)
| Model | Precision | Recall | F1 Score | Benign FPR | ROC-AUC |
|---|---|---|---|---|---|
| XGBoost (Supervised Only) | 86.95% | 0.21% | 0.43% | **0.018%** | 75.30% |
| Random Forest (Supervised Only) | **98.55%** | 5.95% | 11.22% | 0.048% | 82.95% |
| Isolation Forest (Unsupervised) | 38.03% | 11.44% | 17.59% | 10.28% | 85.50% |
| **NetSentinel Hybrid (Ours)** | 68.76% | **35.73%** | **47.02%** | 8.95% | **88.55%** |

#### Friday Class Breakdown:
- **DDoS (LOIC Flood):** Supervised XGBoost = 0.03% $\to$ **Autoencoder Hybrid = 60.18%**
- **Ares Botnet:** Supervised XGBoost = 0.00% $\to$ **Autoencoder Hybrid = 2.41%**
- **PortScan:** Supervised XGBoost = 0.48% $\to$ **Autoencoder Hybrid = 1.98%**

---

## 🖥️ Telemetry Dashboard & Interactive Lab

The project includes a radically minimalist, high-density telemetry console:
- **Real-Time Stream Buffer:** Live packet inspection with throughput monitoring.
- **Inference Lab:** Interactive 49-feature test sandbox with attack presets (`Normal HTTPS`, `DoS Hulk`, `Friday Zero-Day DDoS`, `FTP-Patator`, `PortScan`).
- **Policy Tuning:** Real-time calibration sliders for $\tau_{sup}$ and $\tau_{ae}$.
- **Data Explorer:** Tabular inspection and CSV export for raw evaluation artifacts.

### Running the UI Locally
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📁 Repository Structure

```
├── artifacts-20261125T220117Z-1-001/
│   └── artifacts/
│       ├── executive_summary.csv
│       ├── feature_selection_report.json
│       ├── inference_demo_results.csv
│       ├── track_a_binary_metrics.csv
│       ├── track_a_multiclass_metrics.csv
│       ├── track_b_friday_per_class.csv
│       └── track_b_metrics.csv
├── models/
│   ├── netsentinel_hybrid_bundle.joblib
│   ├── threshold_metadata.json
│   └── track_a_xgb_multiclass.joblib
├── src/
│   ├── components/         # Minimalist UI header, modal, primitives
│   ├── data/               # Model threshold configs & evaluation metrics
│   ├── views/              # Overview, Inspector, Benchmark, Features, Policy, Telemetry
│   ├── App.tsx
│   └── main.tsx
├── Antigravity_CLI_in_Colab.ipynb  # End-to-end training and evaluation notebook
├── package.json
└── README.md
```

---

## 📄 License
This project is open-source under the MIT License.
