# Chat Service

## Objectifs

- Exposer une API pour un service de chat
  - Completion.
  - Historique des messages.
  - Enregistrement de plusieurs conversations.
  - Gestion de plusieurs utilisateurs.
  - Recherche sémentique dans les historiques de conversations.

- L'API se divise en 2:
  - API "ressources" CRUD : user / conversations / messages / recherche.
  - API 'actions" : envoie un message et génère une réponse.


## Service Library

Utilise la librairie service_library pour implémenter chaque endpoint.
