#!/bin/bash

echo "1. Création de la nouvelle arborescence..."
mkdir -p pages
mkdir -p assets/notebooks
mkdir -p assets/pdf

echo "2. Déplacement et renommage des pages..."
mv capitalis_beta.html pages/capitalis.html 2>/dev/null || true
mv fondamentaux_macro.html pages/fondamentaux-macro.html 2>/dev/null || true
mv research_pages/scoring.html pages/scoring-report.html 2>/dev/null || true
mv reports/scoring-report.html pages/scoring-report.html 2>/dev/null || true

echo "3. Déplacement des ressources..."
mv research_ressources/notebooks/* assets/notebooks/ 2>/dev/null || true
mv research_ressources/pdf/* assets/pdf/ 2>/dev/null || true

echo "4. Correction du nom de rapport (17 Janvier)..."
mv reports/reports_17_01_26.html reports/rapport_17_01_26.html 2>/dev/null || true

echo "5. Nettoyage des anciens dossiers..."
rmdir research_pages 2>/dev/null || true
rmdir research_ressources/notebooks 2>/dev/null || true
rmdir research_ressources/pdf 2>/dev/null || true
rmdir research_ressources 2>/dev/null || true

echo "Terminé ! Tout est à sa place."