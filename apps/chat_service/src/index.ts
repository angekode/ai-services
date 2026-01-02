import express from 'express';
import { completionController } from './endpoints/chat-completion/controllers/completion.controller.js';
import { getUserFromUserNameController } from './endpoints/users/contollers.js';

import { 
  getConversationsFromUserId, 
  getMessagesFromConversationId, 
  createConversation 
} from './endpoints/conversations/contollers.js';


// Serveur
const server = express();
server.use(express.json());


// Serveur - Routes
server.use((req, _res, next) => { console.log('Requête reçue: ' + req.url); next(); });
server.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
server.post('/chat/completions', completionController);
server.get('/users/:username', getUserFromUserNameController);
server.get('/users/:userId/conversations', getConversationsFromUserId);
server.get('/conversations/:conversationId/messages', getMessagesFromConversationId);

server.post('/conversations', createConversation);

// Serveur - Lancement
server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));