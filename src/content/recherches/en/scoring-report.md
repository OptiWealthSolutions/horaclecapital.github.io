---
title: 'Scoring Report: Quantitative Model'
description: Technical documentation of the macroeconomic scoring engine. Architecture,
  methodology, and validation of Horacle Capital's quantitative signal.
date: '2026-04-01'
category: Quantitative Research
thumbnail: /assets/img/report_banner.jpg
tags:
- Quantitative
- Finance
- Statistics
- Scoring
- Report
isPremium: true
pdfStoragePath: 'scoring_report.pdf'
lang: 'en'
translationKey: 'scoring-report'
---
<div class="bg-bg-2 border-l-2 border-dim py-6 px-8 mb-12 text-[0.9rem] text-off">
  <strong class="font-mono text-dim uppercase block mb-3 text-[0.7rem] tracking-widest">Note of Inspiration</strong>
  The fundamental idea of this scoring model was initially inspired by the work presented in the video by <a href="https://www.youtube.com/watch?v=Y4wAaoGfp_8" target="_blank" class="text-off border-b border-dim">Brieuc</a>, which we then adapted and extended for our own research.
</div>

<!-- PDF delivered via secure email — "Receive by email" button in the toolbar -->

<div class="exec-summary">
  <strong>Executive Summary</strong>
  This document details the architecture and methodology of our quantitative scoring system. The objective is to propose a multifactor evaluation grid, allowing assets to be systematically ranked and analyzed for portfolio optimization.
</div>

## 1. Introduction
The scoring model was developed to standardize the process of evaluating investment opportunities. The founding idea is to reduce cognitive biases in the analysis and to provide a neutral observation point by quantifying raw market data (price, momentum, etc.).

## 2. Methodology and Metrics Used
The overall score, assigning a grade out of 100 to each asset, rests on several interdependent fundamental pillars:

- **Momentum analysis:** We study trends over different time windows to capture the directional velocity of prices.
- **Volatility and Risk measurement:** The score is penalized or adjusted according to historical variations (variance, drawdowns).
- **Aggregation of Fundamental Data:** Where applicable, the integration of on-chain or macroeconomic metrics to weight an asset's long-term potential.

## 3. Empirical Results and Application
The use of this score in real conditions (Backtest and Forward test) made it possible to build portfolios capable of outperforming their benchmark indices while preserving capital in degraded market conditions.

**Feel free to download the full PDF report via the button at the top of this page to review the detailed formulas, weightings, and illustrative charts.**

<div class="disclaimer">
  <strong>Disclaimer:</strong> This document and its content (including the scoring system's results) are provided for informational and educational purposes only. They do not constitute investment advice.
</div>
