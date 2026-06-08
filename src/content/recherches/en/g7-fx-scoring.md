---
title: 'G7 Macro Scoring: Fundamental Currency Model'
description: Architecture and metrics of the macro-fundamental scoring engine for G7 currencies. Analysis of structural value, cyclical dynamics, and risk regimes.
date: '2026-05-21'
category: Quantitative Research
thumbnail: /assets/img/polymarket_paper.jpg
tags:
- FX
- Macro
- G7
- Quantitative
- Scoring
isPremium: true
pdfStoragePath: 'RESEARCH_PAPER.pdf'
lang: 'en'
translationKey: 'g7-fx-scoring'
---

<div class="bg-bg-2 border-l-2 border-dim py-6 px-8 mb-12 text-[0.9rem] text-off">
  <strong class="font-mono text-dim uppercase block mb-3 text-[0.7rem] tracking-widest">Technical Note</strong>
  This model rests on the "Caveman Quant" philosophy: absolute vectorization, zero look-ahead bias, and an explicit macro rationale for each driver.
</div>

<!-- PDF delivered via secure email — "Receive by email" button in the toolbar -->

<div class="exec-summary">
  <strong>Executive Summary</strong>
  This paper presents the design of a macro-fundamental scoring engine for G7 currencies. The model decomposes the FX signal into three layers: structural value (L1), cyclical dynamics (L2), and risk regime (L3), validated on more than 20 years of historical data.
</div>

## 1. Theoretical Foundations
The value of a currency is determined by the equilibrium of international investment flows, governed by four fundamental forces:

1.  **Interest rate differential:** Based on Uncovered Interest Rate Parity (UIP). Over horizons of 1 to 3 months, carry reversion tends to dominate.
2.  **Trade balance:** Real flows acting as a structural bullish driver for the domestic currency.
3.  **Monetary policy direction:** A cyclical signal anticipating changes in real rates.
4.  **Growth momentum:** A cyclical signal where economic overheating may signal a future deterioration of the current account.

## 2. Model Architecture
The model (Engine 2) uses currency-specific weights, reflecting the distinct mandates of central banks (e.g. the Fed's dual mandate vs the ECB's price stability).

### The Three Signal Layers:
*   **Layer 1 (Structural Value):** Level of the policy rate and change in the trade balance.
*   **Layer 2 (Cyclical Dynamics):** Direction of monetary policy and GDP momentum.
*   **Layer 3 (Risk Regime):** Use of a Gaussian Mixture Model (GMM) on the VIX and the S&P 500 to classify Risk-On / Risk-Off environments.

## 3. Results and Performance
Out-of-sample (OOS), the Engine 2 model shows robust results:
*   **Daily IC:** 0.071 (significant at 5%).
*   **Grinold IR:** 0.60.
*   **Portfolio Performance:** +59.6% cumulative return over the history with a Sharpe of 0.48 and a Max Drawdown contained at -13.8%.

**To access the detailed mathematical formulas, the Newey-West HAC implementation, and the performance charts by zone, download the full report at the top of the page.**

<div class="disclaimer">
  <strong>Disclaimer:</strong> This document is provided for informational and educational purposes only. It does not constitute investment advice.
</div>
