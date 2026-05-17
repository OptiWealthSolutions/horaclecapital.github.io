# Horacle Capital

Bienvenue sur le dépôt officiel du site web **Horacle Capital**.

Horacle Capital est une cellule de recherche indépendante spécialisée dans l'analyse macroéconomique et la finance quantitative. Notre mission est de cartographier les flux de liquidités mondiaux et d'anticiper les cycles structurels en combinant analyse fondamentale et modélisation mathématique (HMM, scoring multifactoriel).

## 🚀 Architecture & Technologies

Ce projet est propulsé par les technologies suivantes :

- **[Astro](https://astro.build/)** : Le framework web conçu pour la vitesse, utilisé en mode statique (SSG).
- **[Tailwind CSS](https://tailwindcss.com/)** : Pour le stylisme utilitaire, complété par l'extension `@tailwindcss/typography` pour le formatage parfait du Markdown.
- **Vanilla CSS** : Une approche "Impeccable" utilisant le fichier `public/style.css` pour les variables globales et le design premium.
- **Markdown / Content Collections** : La gestion des articles de recherche et des rapports hebdomadaires se fait directement via des fichiers `.md` dans `src/content/`.

## 📂 Structure du projet

```text
/
├── public/                 # Assets statiques (images, CSS global, scripts)
├── src/
│   ├── components/         # Composants Astro réutilisables (TagList, etc.)
│   ├── content/            # Collections de contenu Markdown (rapports, recherches, portfolios)
│   ├── layouts/            # Layouts globaux (BaseLayout, ArticleLayout)
│   └── pages/              # Pages routées (index, portfolio, rapports, etc.)
├── tailwind.config.mjs     # Configuration de Tailwind CSS
└── astro.config.mjs        # Configuration du framework Astro
```

## 🛠️ Commandes Locales

Toutes les commandes sont exécutées depuis la racine du projet, en utilisant Node.js (via npm).

| Commande                   | Action                                                                          |
| :------------------------- | :------------------------------------------------------------------------------ |
| `npm install`              | Installe les dépendances du projet (incluant Tailwind et Typography).         |
| `npm run dev`              | Lance le serveur de développement local (généralement sur `localhost:4321`).  |
| `npm run build`            | Compile le site final prêt pour la production dans le dossier `dist/`.        |
| `npm run preview`          | Prévisualise le rendu de build en local.                                      |

## 📝 Gestion du contenu (Markdown)

Pour ajouter un nouveau rapport ou une nouvelle recherche :
1. Créez un fichier `.md` dans `src/content/rapports/` ou `src/content/recherches/`.
2. Ajoutez le frontmatter requis en haut du fichier (titre, description, auteur, date, tags).
3. Rédigez le contenu ; le plugin Tailwind Typography formatera automatiquement les titres (h2, h3) et les paragraphes avec la charte graphique du site.

---
*© Horacle Capital - Le signal, pas le bruit.*
