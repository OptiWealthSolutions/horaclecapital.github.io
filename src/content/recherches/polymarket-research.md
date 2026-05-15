---
title: Microstructure & Algorithmic Arbitrage on Prediction Markets
description: Recherche sur la participation algorithmique et le market making sur
  Polymarket. Cadre théorique et application empirique.
date: '2026-04-20'
category: Finance Quantitative
thumbnail: /assets/img/polymarket_paper.jpg
tags:
- Quantitative
- Finance
- Statistics
- Microstructure
- Algorithmic
---
<div class="exec-summary">
  <strong>Executive Summary</strong>
  Ce document développe un cadre quantitatif rigoureux pour la participation algorithmique sur les marchés de prédiction décentralisés (DPM), en utilisant Polymarket comme environnement empirique principal. Nous analysons les dynamiques de carnet d'ordres et les opportunités d'arbitrage statistique.
</div>

## 1. Contexte du Marché
Les marchés de prédiction décentralisés offrent une structure unique où l'information est agrégée de manière asynchrone. L'étude se concentre sur l'efficience de ces marchés face aux événements géopolitiques et macroéconomiques.

## 2. Stratégies Market Making
Nous modélisons une stratégie de tenue de marché (Market Making) ajustée à l'inventaire, visant à fournir de la liquidité tout en minimisant le risque directionnel (Delta Neutral).

- **Modèle Avellaneda-Stoikov adapté :** Ajustement des spreads en fonction de la volatilité implicite du contrat.
- **Gestion des Risques :** Limites strictes sur la taille des positions et couverture (Hedging) via d'autres instruments si disponible.

## 3. Arbitrage et Microstructure
Analyse de la latence et de l'impact des frais de gaz (Polygon) sur l'exécution des stratégies à haute fréquence. L'étude démontre la présence de corrélations exploitables entre les marchés de prédiction et les marchés de dérivés classiques.

## Ressources
Le papier complet est disponible en téléchargement ci-dessous pour une étude approfondie des formules mathématiques et des résultats de backtest.

<div class="text-center my-12 flex flex-col items-center gap-4">
  <a href="/assets/pdf/polymarket_paper.pdf" target="_blank" download class="btn-primary text-white" style="color: white !important;">
    Télécharger le Research Paper (PDF)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </a>
</div>

<div class="disclaimer">
  <strong>Avertissement :</strong> Cette recherche est fournie à titre académique. Le trading algorithmique comporte des risques de perte totale du capital.
</div>
