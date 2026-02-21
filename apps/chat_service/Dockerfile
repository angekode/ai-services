# Téléchargement des modules nécessaires pour llm_library + chat_service
# ----------------------------------------------------------------------
FROM node:24-alpine AS dependencies

WORKDIR /repo

COPY packages/llm_library/package.json ./packages/llm_library/package.json
COPY packages/service_library/package.json ./packages/service_library/package.json
COPY apps/chat_service/package.json ./apps/chat_service/package.json

COPY package.json ./

# Télécharge uniquement les dépendances des workspaces dans /repo/node_modules
RUN npm install --workspaces --include-workspace-root=false


# Compilation des workspaces
# ----------------------------------------------------------------------
FROM node:24-alpine AS building

WORKDIR /repo

# Copie des modules de chaque workspace dans un dossier commun
COPY --from=dependencies /repo/node_modules ./node_modules

# Copie des fichiers typescript
COPY packages/llm_library ./packages/llm_library
COPY packages/service_library ./packages/service_library
COPY apps/chat_service ./apps/chat_service

COPY --from=dependencies /repo/package.json ./package.json

# Compilation des fichiers typescript dans les dossiers .../dist
RUN npm run build --workspace packages/llm_library
RUN npm run build --workspace packages/service_library
RUN npm run build --workspace apps/chat_service


# Runtime
# ----------------------------------------------------------------------
FROM node:24-alpine AS runtime

WORKDIR /app

# Copie des modules
COPY --from=building /repo/node_modules ./node_modules
# node_module contient des simlinks vers packages/llm_library et service_library donc il faut les copier
COPY --from=building /repo/packages/llm_library ./packages/llm_library
COPY --from=building /repo/packages/service_library ./packages/service_library

# Copie des fichiers compilés des librairies
COPY --from=building /repo/apps/chat_service/dist ./dist
COPY --from=building /repo/apps/chat_service/package.json ./package.json

ARG PORT
EXPOSE ${PORT}

CMD ["node", "dist/index.js"]

