#!/bin/bash
npm install
cd ./packages/llm_library
npm install typescript
npm install @langchain/community@^1 @langchain/core@^1 @langchain/openai @langchain/mistralai @langchain/ollama
npm install mammoth pdf-parse
npm install --save-dev @types/node
npx tsc # compilation code
npx tsc --project tsconfig.test.json # compilation tests
node --env-file=.env.test ./dist-test/langchain-llm-client.test.js # lancement tests
read -p 'Ajouter <<"rewriteRelativeImportExtensions": true,>> dans tsconfig.json et appuyer sur <<Entrée>>'
find . -name "*.ts" -exec sed -i -E 's/\.js"/.ts"/g' {} +
find . -name "*.ts" -exec sed -i -E "s/\.js'/.ts'/g" {} +
