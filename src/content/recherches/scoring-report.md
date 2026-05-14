---
title: "Scoring Report : Modèle Quantitatif"
description: "Documentation technique du moteur de scoring macroéconomique. Architecture, méthodologie et validation du signal quantitatif d'Horacle Capital."
date: "2026-04-01"
category: "Recherche Quantitative"
thumbnail: "/assets/img/report_banner.jpg"
---

<div class="bg-bg-2 border-l-2 border-dim py-6 px-8 mb-12 text-[0.9rem] text-off">
  <strong class="font-mono text-dim uppercase block mb-3 text-[0.7rem] tracking-widest">Note d'Inspiration</strong>
  L'idée fondamentale de ce modèle de scoring est initialement inspirée par les travaux présentés dans la vidéo de <a href="https://www.youtube.com/watch?v=Y4wAaoGfp_8" target="_blank" class="text-off border-b border-dim">Brieuc</a>, que nous avons ensuite adaptés et étendus pour nos propres recherches.
</div>

<!-- Bouton de téléchargement du PDF -->
<div class="text-center mb-12">
  <a href="/assets/pdf/scoring_report.pdf" target="_blank" download class="btn-primary text-white border-b-0" style="color: white !important;">
    Télécharger le Rapport PDF
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  </a>
</div>

<div class="exec-summary">
  <strong>Executive Summary</strong>
  Ce document détaille l'architecture et la méthodologie de notre système de scoring quantitatif. L'objectif est de proposer une grille d'évaluation multifactorielle, permettant de classer et d'analyser systématiquement les actifs pour l'optimisation des portefeuilles.
</div>

## 1. Introduction
Le modèle de scoring a été développé pour standardiser le processus d'évaluation des opportunités d'investissement. L'idée fondatrice est de réduire les biais cognitifs dans l'analyse et d'apporter un point d'observation neutre en quantifiant les données de marché brutes (prix, momentum, etc.).

## 2. Méthodologie et Métriques Utilisées
Le score global, attribuant une note sur 100 à chaque actif, repose sur plusieurs piliers fondamentaux interdépendants :

- **L'analyse du Momentum :** Nous étudions les tendances sur différentes fenêtres temporelles pour capter la vélocité directionnelle des prix.
- **Mesure de la Volatilité et du Risque :** Le score est pénalisé ou ajusté selon les variations historiques (variance, drawdowns).
- **Agrégation de Données Fondamentales :** Si applicable, l'intégration de métriques on-chain ou macro-économiques pour pondérer le potentiel à long terme d'un actif.

## 3. Résultats Empiriques et Application
L'utilisation de ce score en situation réelle (Backtest et Forward test) a permis de construire des portefeuilles capables de surperformer leurs indices de référence tout en préservant le capital dans des conditions de marché dégradées.

**N'hésitez pas à télécharger l'intégralité du rapport PDF via le bouton situé en haut de cette page pour prendre connaissance des formules détaillées, des pondérations et des graphiques d'illustration.**

<div class="disclaimer">
  <strong>Avertissement :</strong> Ce document et son contenu (y compris les résultats du système de scoring) sont fournis à titre exclusivement informatif et pédagogique. Ils ne constituent pas un conseil en investissement.
</div>
