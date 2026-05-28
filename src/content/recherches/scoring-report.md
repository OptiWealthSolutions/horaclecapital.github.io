---
title: 'Scoring Report : Modèle Quantitatif'
description: Documentation technique du moteur de scoring macroéconomique. Architecture,
  méthodologie et validation du signal quantitatif d'Horacle Capital.
date: '2026-04-01'
category: Recherche Quantitative
thumbnail: /assets/img/report_banner.jpg
tags:
- Quantitative
- Finance
- Statistics
- Scoring
- Report
isPremium: true
pdfStoragePath: 'scoring_report.pdf'
---
<div class="bg-bg-2 border-l-2 border-dim py-6 px-8 mb-12 text-[0.9rem] text-off">
  <strong class="font-mono text-dim uppercase block mb-3 text-[0.7rem] tracking-widest">Note d'Inspiration</strong>
  L'idée fondamentale de ce modèle de scoring est initialement inspirée par les travaux présentés dans la vidéo de <a href="https://www.youtube.com/watch?v=Y4wAaoGfp_8" target="_blank" class="text-off border-b border-dim">Brieuc</a>, que nous avons ensuite adaptés et étendus pour nos propres recherches.
</div>

<!-- PDF livré par email sécurisé — bouton "Recevoir par email" dans la toolbar -->

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
