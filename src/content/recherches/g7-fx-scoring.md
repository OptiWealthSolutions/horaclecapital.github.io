---
title: 'Scoring Macro G7 : Modèle Fondamental Devises'
description: Architecture et métriques du moteur de scoring macro-fondamental pour les devises du G7. Analyse de la valeur structurelle, de la dynamique cyclique et des régimes de risque.
date: '2026-05-21'
category: Recherche Quantitative
thumbnail: /assets/img/polymarket_paper.jpg
tags:
- FX
- Macro
- G7
- Quantitative
- Scoring
isPremium: true
pdfStoragePath: 'RESEARCH_PAPER.pdf'
---

<div class="bg-bg-2 border-l-2 border-dim py-6 px-8 mb-12 text-[0.9rem] text-off">
  <strong class="font-mono text-dim uppercase block mb-3 text-[0.7rem] tracking-widest">Note Technique</strong>
  Ce modèle repose sur la philosophie "Caveman Quant" : vectorisation absolue, zéro biais de lookahead et rationale macro explicite pour chaque driver.
</div>

<!-- PDF livré par email sécurisé — bouton "Recevoir par email" dans la toolbar -->

<div class="exec-summary">
  <strong>Executive Summary</strong>
  Ce papier présente la conception d'un moteur de scoring macro-fondamental pour les devises du G7. Le modèle décompose le signal de change en trois couches : valeur structurelle (L1), dynamique cyclique (L2) et régime de risque (L3), validées sur plus de 20 ans de données historiques.
</div>

## 1. Fondements Théoriques
La valeur d'une devise est déterminée par l'équilibre des flux d'investissement internationaux, gouvernés par quatre forces fondamentales :

1.  **Différentiel de taux d'intérêt :** Basé sur la Parité Non Couverte des Taux (UIP). Sur des horizons de 1 à 3 mois, la réversion du carry tend à dominer.
2.  **Balance commerciale :** Les flux réels agissant comme un moteur structurel haussier pour la devise domestique.
3.  **Direction de politique monétaire :** Signal cyclique anticipant les variations des taux réels.
4.  **Momentum de croissance :** Signal cyclique où une surchauffe économique peut signaler une future détérioration de la balance courante.

## 2. Architecture du Modèle
Le modèle (Engine 2) utilise des poids spécifiques par devise, reflétant les mandats distincts des banques centrales (ex: double mandat Fed vs stabilité des prix BCE).

### Les Trois Couches de Signal :
*   **Layer 1 (Valeur Structurelle) :** Niveau du taux directeur et variation de la balance commerciale.
*   **Layer 2 (Dynamique Cyclique) :** Direction de la politique monétaire et momentum du PIB.
*   **Layer 3 (Régime de Risque) :** Utilisation d'un Modèle de Mélange Gaussien (GMM) sur le VIX et le S&P500 pour classifier les environnements Risk-On / Risk-Off.

## 3. Résultats et Performance
En échantillon hors-test (OOS), le moteur Engine 2 affiche des résultats robustes :
*   **IC Journalier :** 0.071 (significatif à 5%).
*   **Grinold IR :** 0.60.
*   **Performance Portefeuille :** +59.6% de rendement cumulé sur l'historique avec un Sharpe de 0.48 et un Max Drawdown contenu à -13.8%.

**Pour accéder aux formules mathématiques détaillées, à l'implémentation du Newey-West HAC et aux graphiques de performance par zone, téléchargez le rapport complet en haut de page.**

<div class="disclaimer">
  <strong>Avertissement :</strong> Ce document est fourni à titre informatif et éducatif uniquement. Il ne constitue pas un conseil en investissement.
</div>
