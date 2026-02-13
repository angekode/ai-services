#!/bin/bash
#set -x # pour afficher les commandes

# Initialisation du dépot
git init
git add .
git commit -m "Création du dépot"

# Création du workspace
npm init -y
sed -i 's/commonjs/module/g' package.json
npm init -y -w packages/llm_library
sed -i 's/commonjs/module/g' ./packages/llm_library/package.json
git add .
git commit -m "Création du workspace packages/llm_library"

# Copie de l'ancien dépot
git clone ../../ai-services/rag_library/ llm_library_old_repo
cd llm_library_old_repo

# Reécriture de l'historique pour que le contenu soit déplacé dans packages/llm_library
git filter-repo --to-subdirectory-filter packages/llm_library # sudo apt install filter-repo

# Merge de l'ancien dépot
cd ..
git remote add llm_library_old_repo ./llm_library_old_repo
git fetch llm_library_old_repo
git merge --allow-unrelated-histories llm_library_old_repo/master

# Résoudre les conflits évantuels et faire un commit de merge