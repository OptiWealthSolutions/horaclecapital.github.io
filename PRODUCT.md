# PRODUCT.md — Horacle Capital

## Product Purpose

Horacle Capital est une structure de recherche indépendante spécialisée dans l'analyse macroéconomique et la modélisation statistique/quantitative des marchés financiers. Ce n'est pas un outil grand public ni une plateforme de conseil en investissement. C'est une publication de recherche analytique sérieuse, accessible à tout lecteur curieux des marchés.

## Register

brand

## Users

Passionnés de marchés financiers, étudiants en finance/économie, traders indépendants et investisseurs autonomes à la recherche d'analyses rigoureuses. Pas de client institutionnel pour l'instant. Le ton est professionnel mais accessible, jamais condescendant.

## Core Offering

- **Rapports macro hebdomadaires** : décryptage de l'environnement macro-financier mondial (banques centrales, cycles, géopolitique, marchés)
- **Recherche quantitative** : modèles statistiques (HMM, scoring multifactoriel), notebooks Python, papiers de recherche
- **Capitalis** (SaaS bêta) : application d'investissement — Screening, Scoring, Allocation, Reporting
- **Horacle Academy** : cours particuliers en macroéconomie, statistiques et finance quantitative

## Brand Tone

Rigoureux, direct, sans fioriture. Analyse institutionnelle appliquée à la recherche indépendante. Pas de marketing creux, pas de promesses de performance. Signal, pas bruit.

Termes à éviter : "Journal Macro", "Discipline Transparence Performance", "écosystème analytique de référence", tout ce qui sonne comme un slogan SaaS générique.

## Design Principles

- **Colors** : palette bleue (--blue #1E40AF, --blue-2 #2563EB, --blue-3 #60A5FA) sur fond blanc/navy. Ne pas changer.
- **Typography** : DM Serif Display (titres) + DM Sans (corps). Maximum 2 polices. Ne pas changer.
- **Mode** : light body, dark nav + hero + footer + newsletter. Ne pas inverser.
- **Anti-references** : hero-metric template (faux chiffres en temps réel), glassmorphism décoratif, cartes identiques en grille, side-stripe borders sur callouts, gradient text.

## Architecture Technique

- Site statique HTML + CSS (style.css) + JS (main.js) pour les pages principales
- Tailwind CDN pour les utilitaires inline dans le HTML
- Astro pour les pages dynamiques : `src/pages/rapports/[slug].astro` et `src/pages/recherches/[slug].astro`
- Contenus markdown dans `src/content/rapports/` et `src/content/recherches/`
- Build via GitHub Actions → GitHub Pages (horaclecapital.com)
- **Important** : `package-lock.json` doit être committé pour que `npm ci` fonctionne en CI

## Anti-Patterns (absolus)

- Side-stripe borders (`border-left > 1px` comme accent coloré sur cards/callouts)
- Hero-metric template (grand chiffre + label + données de marché fictives)
- Données de marché fictives ou statiques affichées comme "live"
- Cartes identiques en grille (même structure, même taille, répétées)
- Gradient text (`background-clip: text`)
- Terminal-speak dans l'UI ("SYSTÈME", "SCANNING MARKET", crochets `[ ]` partout)
