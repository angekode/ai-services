user
- username
- password
- conversations

conversation
- title
- messages
- user

message
- content
- role


user 0,N - 1,1 conversation
conversation 0,N - 1,1 message

user N-1 conversation => conversation(user_id)
conversation N-1 message => message(conversation_id)

user (#id, username, password)
conversation (#conversation_id, title, -user_id)
message(role, content, -conversation_id)


infos sur un utilisateur
  GET /users/username
pour un utilisateur => liste des conversations
  GET /user/:id/conversations
pour un utilisateur => une conversation par son id
  GET /conversations/:id
pour une conversation => liste des messages
  GET /conversations/:id/messages
pour un message => les infos
  GET /messages/:id
pour un utilisateur => créer une conversation
  POST /conversations

poser une question pour une conversation donnée
  POST /conversations/:id/messages:complete
