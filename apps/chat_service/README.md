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

## Routes

### Liste des messages

- Requête
```http
GET http://localhost:3001/conversations/:conversationId/messages
```

- Réponse
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

### Information sur un user
- Requête
```http
GET http://localhost:3001/users/:username
```

- Réponse
```json
{
  id: number,
  username: string
}
```

### Liste des conversations

- Requête
```http
GET http://localhost:3001/users/1/conversations
```

- Réponse
```json
[
  {
    id: number,
    title: string,
    user_id: number
  },
  ...
]
```

### Poser une question en mode single

- Requête
```http
POST http://localhost:3001/conversations/:conversationId/messages:complete
Content-Type: application/json
```

- Réponse
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

- Requête
```http
POST http://localhost:3001/conversations/:conversationId/messages:complete
Content-Type: application/json
```

- Réponse ('Content-Type': 'text/event-stream') (SSE Events)
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
