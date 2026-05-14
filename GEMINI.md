# Horacle Capital - Instructions du Projet

Ce fichier définit les standards, les conventions et les flux de travail pour le développement du site Horacle Capital. Il prévaut sur les instructions générales.

## 🏛 Architecture & Stack
- **Framework :** Astro (mode `file` pour le build).
- **Stylisme :** Majoritairement **Vanilla CSS** (`style.css`). TailwindCSS est utilisé de manière ponctuelle pour certains composants via un script injecté.
- **Contenu :** Géré par des collections Astro (`src/content/rapports`, `src/content/recherches`) en Markdown.
- **Déploiement :** GitHub Pages via `.github/workflows/deploy.yml`.

## ✍️ Standards de Rédaction & SEO
- **Ton :** Senior, professionnel, "high-signal". Éviter le jargon marketing superflu. Le contenu doit refléter une expertise en analyse financière et macroéconomie.
- **Langue :** Français pour tout le contenu public.
- **Structure Hn :** 
    - Un seul `H1` par page (obligatoire).
    - Hiérarchie logique : `H1` -> `H2` -> `H3` -> `H4`.
    - Pas de saut de niveau.
- **SEO :** Chaque page doit avoir un titre et une description optimisés dans le frontmatter. Utiliser les mots-clés : *Analyse Macroéconomique*, *Finance Quantitative*, *Modélisation Statistique*.

## 🛠 Workflow de l'Agent
- **Multi-Agents :** Pour les tâches lourdes (refactorisation globale, correction d'erreurs en série, audit complet), **déployer systématiquement des sous-agents** (`generalist`, `codebase_investigator`) pour optimiser la fenêtre de contexte et l'efficacité.
- **Validation :** Toujours lancer le serveur de développement (`npm run dev`) pour vérifier le rendu visuel et la console Astro après chaque modification majeure.
- **Édition de CSS :** `style.css` est volumineux. Privilégier des éditions chirurgicales via `replace` plutôt que de réécrire des sections entières, sauf nécessité de refonte.

## 🚫 Règles Spécifiques
- **Legacy :** La section "Capitalis" a été supprimée. Ne jamais réintroduire de références à cette marque ou à ses services associés.
- **Thème :** Respecter l'esthétique institutionnelle (couleurs sombres, accents bleus `#2563EB`, typographies Serif pour les titres).
