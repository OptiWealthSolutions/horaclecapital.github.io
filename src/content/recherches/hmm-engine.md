---
title: 'HMM Engine : Détection de Régimes de Marché'
description: Moteur d'inférence basé sur les modèles de Markov cachés (Hidden Markov
  Models) pour identifier et modéliser les différents régimes de volatilité et de
  tendance sur les marchés financiers.
date: '2026-04-15'
category: Finance Quantitative
thumbnail: /assets/img/notebook_banner.jpg
tags:
- Quantitative
- Finance
- Statistics
- Engine
- Détection
---
<div class="exec-summary">
  <strong>Introduction au Projet</strong>
  Le projet HMM Engine vise à fournir un cadre mathématique pour la segmentation temporelle des séries financières. Contrairement aux approches linéaires classiques, les modèles de Markov cachés permettent de capturer la dynamique non-stationnaire des prix.
</div>

## Architecture du Modèle
Le moteur utilise un algorithme de Baum-Welch pour l'apprentissage des paramètres et l'algorithme de Viterbi pour le décodage de la séquence d'états la plus probable.

- **États :** Typiquement configuré pour détecter 3 régimes (Baisse Volatile, Latéralisation, Hausse Stable).
- **Inputs :** Log-rendements, volatilité réalisée, et spreads de taux.

## Visualisation & Code
Vous pouvez consulter le notebook complet incluant l'implémentation en Python (Scikit-learn / Hmmlearn) via le lien ci-dessous.

<div class="text-center my-12 flex flex-col items-center gap-4">
  <a href="/assets/notebooks/HMM_engine.ipynb" target="_blank" download class="btn-primary text-white" style="color: white !important;">
    Télécharger le Notebook (IPYNB)
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </a>
  <a href="https://github.com/horaclecapital" target="_blank" class="text-off border-b border-dim text-sm hover:text-blue-2 transition-colors">
    Visualiser le code sur GitHub
  </a>
</div>

## Cas d'Usage
Ce modèle est utilisé par Horacle Capital pour ajuster l'exposition au risque (De-risking) lorsque le régime "Baisse Volatile" est détecté avec une probabilité supérieure à 70%.

<div class="disclaimer">
  <strong>Avertissement :</strong> Ce modèle est fourni à titre de recherche académique. Les performances passées ne garantissent pas les résultats futurs.
</div>
