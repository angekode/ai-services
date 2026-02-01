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
  - API 'actions" : génère une réponse.


## Service Library

Utilise la librairie service_library pour implémenter chaque endpoint.

## Routes

### Utilisateurs

#### Obtenir des informations sur un utilisateur
```http
GET http://localhost:3001/users/:username
```

#### Créer un utilisateur

- Requête client:
```http
POST http://localhost:3001/users
Content-Type: application/json

{
  "username": <nom de l'utilisateur>,
  "password": <mot de passe de l'utilisateur>
}
```
- Réponse API:
  - Code Status 201 si l'utilisateur est crée
  - Body
```json
{
  "id": <id de l'utilisateur>
  "username": <nom de l'utilisateur>,
  "password": <mot de passe de l'utilisateur>
}
```

### Lister les conversations d'un utilisateur

- Requête client:
```http
GET http://localhost:3001/users/:userId/conversations
```
- Réponse API:
  - Code Status 200 si l'utilisateur existe
  - Body
```json
[
  {
    "conversation_id": <id de la conversation>,
    "title": <titre>,
    "user_id": <id de l'utilisateur>
  },
  {
    "conversation_id": <id de la conversation>,
    "title": <titre>,
    "user_id": <id de l'utilisateur>
  },
  ...
]
```


### Conversations

#### Créer une conversation

- Requête client:
```http
POST http://localhost:3001/conversations
Content-Type: application/json

{
  "title": <titre de la conversation>,
  "user_id": <id de l'utilisateur qui crée la conversation>
}
```

- Réponse de l'API:
  - Code status 201 si la conversation est crée
  - Body:
```json
{
  "id": <id de la conversation crée>
  "title": <titre de la conversation>,
  "user_id": <id de l'utilisateur qui crée la conversation>
}
```


#### Lister les messages d'une conversations

- Requête client:
```http
GET http://localhost:3001/conversations/:conversationId/messages
```

- Réponse de l'API:
  - Code status 200
  - Body:
```json
[
  {
    id: number,
    role: 'user' | 'assistant' | 'system',
    content: string
  },
  ...
]
```


### Poser une question en mode single

- Requête client
```http
POST http://localhost:3001/conversations/:conversationId/messages:complete
Content-Type: application/json

{
  "stream": false
}
```

- Réponse API
```json
{
  choices: [
    {
      finish_reason: 'stop',
      index: number,
      message: {
        role: 'assistant',
        content: string
      }
    }
  ]
}
```


### Poser une question en mode stream

- Requête client
```http
POST http://localhost:3001/conversations/:conversationId/messages:complete
Content-Type: application/json

{
  "stream": true
}
```

- Réponse API
  - ('Content-Type': 'text/event-stream') (SSE Events)
- Body de chaque event: `DATA: <json>`:
```json
{
  choices: [
    {
      finish_reason: 'stop',
      index: number,
      delta: {
        role: 'assistant',
        content: string
      }
    }
  ]
}
```
- Body de l'envent final: `DATA: [DONE]`