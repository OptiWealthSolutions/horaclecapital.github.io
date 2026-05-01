#!/bin/bash

# Arrêt en cas d'erreur
set -e

# Supprime les dossiers temporaires Claude de la mémoire de Git (évite l'erreur de sous-module)
git rm -r --cached .claude/ 2>/dev/null || true

# Ajout de tous les fichiers
git add .

# Commit avec message par défaut
git commit -m "maj"

# Push vers la branche courante
git push