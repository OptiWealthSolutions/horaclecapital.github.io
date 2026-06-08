---
title: Microstructure & Algorithmic Arbitrage on Prediction Markets
description: Research on algorithmic participation and market making on
  Polymarket. Theoretical framework and empirical application.
date: '2026-04-20'
category: Quantitative Finance
thumbnail: /assets/img/polymarket_paper.jpg
tags:
- Quantitative
- Finance
- Statistics
- Microstructure
- Algorithmic
isPremium: true
lang: 'en'
translationKey: 'polymarket-research'
---
<div class="exec-summary">
  <strong>Executive Summary</strong>
  This document develops a rigorous quantitative framework for algorithmic participation in decentralized prediction markets (DPM), using Polymarket as the primary empirical environment. We analyze order-book dynamics and statistical arbitrage opportunities.
</div>

## 1. Market Context
Decentralized prediction markets offer a unique structure where information is aggregated asynchronously. The study focuses on the efficiency of these markets in the face of geopolitical and macroeconomic events.

## 2. Market Making Strategies
We model an inventory-adjusted market-making strategy, aimed at providing liquidity while minimizing directional risk (Delta Neutral).

- **Adapted Avellaneda-Stoikov model:** Adjustment of spreads as a function of the contract's implied volatility.
- **Risk Management:** Strict limits on position size and hedging via other instruments where available.

## 3. Arbitrage and Microstructure
Analysis of latency and the impact of gas fees (Polygon) on the execution of high-frequency strategies. The study demonstrates the presence of exploitable correlations between prediction markets and classic derivatives markets.

## Resources
The full paper is available for download below for an in-depth study of the mathematical formulas and backtest results.

<div class="text-center my-12 flex flex-col items-center gap-4">
  <a href="/assets/pdf/polymarket_paper.pdf" target="_blank" download class="btn-primary text-white" style="color: white !important;">
    Download the Research Paper (PDF)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </a>
</div>

<div class="disclaimer">
  <strong>Disclaimer:</strong> This research is provided for academic purposes. Algorithmic trading carries the risk of total loss of capital.
</div>
