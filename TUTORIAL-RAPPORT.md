# Publier un nouveau rapport — Guide

Deux méthodes. Utilise la **Méthode A (HTML statique)** pour aller vite. La **Méthode B (Markdown Astro)** est prévue pour l'avenir mais nécessite que le build Astro génère la page.

---

## Méthode A — HTML statique (recommandée aujourd'hui)

### 1. Copier un rapport existant

```bash
cp reports/rapport_24_04_26.html reports/rapport_DD_MM_AA.html
```

Convention de nommage : `rapport_JJ_MM_AA.html`  
Exemples : `rapport_01_05_26.html`, `rapport_08_05_26.html`

### 2. Modifier le fichier copié

Ouvrir `reports/rapport_DD_MM_AA.html` et changer :

**Dans `<head>` :**
```html
<title>TITRE DU RAPPORT | Rapport Macro - Horacle Capital</title>
<meta name="description" content="DESCRIPTION COURTE (160 car max)" />
<meta property="og:title" content="TITRE DU RAPPORT | Rapport Macro" />
<meta property="og:description" content="DESCRIPTION COURTE" />
<meta property="og:url" content="https://horaclecapital.com/reports/rapport_DD_MM_AA.html" />
```

**Dans `<header class="page-header">` :**
```html
<span>CATEGORIE</span>        <!-- ex: Politique Monétaire -->
<h1>TITRE DU RAPPORT</h1>
<p>Semaine du JJ/MM au JJ/MM/AAAA</p>
```

**Corps de l'article :** Remplace tout le contenu entre `<main>` et `<!-- Sources & Références -->`.  
Structure recommandée :
- `<h2>` pour chaque section macro (Macro US, Zone Euro, Marchés, Forex, etc.)
- `<div class="exec-summary">` pour le résumé exécutif en début d'article
- `<div class="strategy-box"><h4>...</h4><p>...</p></div>` pour les encadrés théoriques
- `<blockquote>` pour les citations de discours de banquiers centraux

**Sources & Références :** La section est déjà présente (sources génériques). Pour ajouter une source spécifique au rapport, insère un `<a>` supplémentaire dans la grille `.grid.grid-cols-2` avant `<!-- Bio Auteur -->`.

### 3. Ajouter la carte dans `reports.html`

Ouvrir `reports.html` et ajouter une `<article>` dans la grille, **au début de la grille** (après le premier article featured si c'est le plus récent) :

```html
<article class="group flex flex-col border border-[var(--border)] hover:border-[rgba(37,99,235,0.4)] transition-colors duration-300 overflow-hidden">
  <div class="relative overflow-hidden bg-[var(--bg-2)]" style="aspect-ratio:16/9">
    <img src="https://images.unsplash.com/photo-XXXXXXXXXX?w=800&q=80&auto=format&fit=crop"
         alt=""
         class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
         onerror="this.src='assets/img/banner.jpg'">
  </div>
  <div class="p-6 flex flex-col flex-1">
    <div class="flex items-center gap-3 mb-3">
      <span style="font-family:var(--ff-body);font-size:0.58rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue-2)">CATEGORIE</span>
      <span style="font-family:var(--ff-body);font-size:0.68rem;color:var(--dim)">JJ Mmm AAAA</span>
    </div>
    <h3 class="font-head text-[var(--text)] leading-snug mb-3 flex-1" style="font-size:1.05rem">TITRE</h3>
    <p style="font-family:var(--ff-body);font-size:0.82rem;color:var(--off);line-height:1.65;margin-bottom:1.25rem">RÉSUMÉ EN 1-2 PHRASES.</p>
    <a href="reports/rapport_DD_MM_AA.html" style="display:inline-flex;align-items:center;gap:6px;font-family:var(--ff-body);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--text);border-bottom:1px solid var(--border);padding-bottom:3px">
      Lire
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </a>
  </div>
</article>
```

Si c'est le rapport **le plus récent**, remplace aussi le bloc "Article à la une" dans `reports.html`.

### 4. Mettre à jour `index.html`

Dans la section **Publications** de `index.html`, mets à jour le lien et le titre du rapport le plus récent.

### 5. Committer et pousser

```bash
git add reports/rapport_DD_MM_AA.html reports.html index.html
git commit -m "rapport: DD/MM/AA - TITRE COURT"
git push
```

GitHub Actions build et déploie automatiquement. Délai : ~2 minutes.

---

## Méthode B — Markdown Astro (avenir)

Crée un fichier dans `src/content/rapports/` :

```
src/content/rapports/rapport-DD-MM-AA.md
```

**Frontmatter obligatoire :**

```yaml
---
title: "TITRE DU RAPPORT"
description: "Description courte (160 car max)"
date: "AAAA-MM-JJ"
author: "Léo Lombardini"
category: "Macro Economics"
issue: "N°XX"
tags: ["Fed", "Inflation", "Marchés"]
draft: false
---
```

**Corps :** Markdown standard. Les classes HTML disponibles dans le layout :
- `exec-summary` → encadré résumé
- `strategy-box` → encadré théorique
- La section Sources & Références est dans `src/layouts/ArticleLayout.astro` — à ajouter manuellement si absent.

**URL générée automatiquement :** `horaclecapital.com/rapports/rapport-DD-MM-AA`

> Note : Méthode B donne une URL propre sans `.html`. Nécessite que le build Astro fonctionne.  
> Ajoute ensuite la carte dans `reports.html` de la même façon qu'en Méthode A.

---

## Images Unsplash pour les rapports

Choisis une image finance/macro sur [unsplash.com](https://unsplash.com) → copie l'ID photo dans l'URL.

Format : `https://images.unsplash.com/photo-XXXXXXXXXXXXXXXXXX?w=800&q=80&auto=format&fit=crop`

IDs fiables pour macro/finance :
- `1611974789855-9c2a0a7236a3` — écrans trading
- `1642790106117-e829e14a795f` — data financière
- `1526304640581-d334cdbbf45e` — bourse/marchés
- `1551288049-bebda4e38f71` — analytics/data
- `1590283603385-17ffb3a7f29f` — salles de marché
- `1535320903710-d993d3d77d29` — économie mondiale

Toujours inclure `onerror="this.src='assets/img/banner.jpg'"` (ou `../assets/img/banner.jpg` depuis `/reports/`).

---

## Catégories disponibles

| Label affiché | Exemples de sujets |
|---|---|
| Politique Monétaire | Fed, BCE, taux, QT/QE |
| Macro Global | PIB, cycles, croissance mondiale |
| Inflation | CPI, PCE, prix énergie |
| Marchés & Taux | S&P, yields, spreads |
| Géopolitique | Guerres, sanctions, élections |
| Banques Centrales | FOMC, réunions, forward guidance |
| Énergie & Matières | Pétrole, gaz, commodities |
| Forex | USD, EUR, JPY, carry trades |
