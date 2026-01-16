import express from 'express';
import dotenv from 'dotenv';
import zod, { ZodError } from 'zod';

import { initDatabase } from './database/client.js';
import { completionController } from './endpoints/chat-completion/controllers/completion.controller.js';
import { getUserFromUserNameController } from './endpoints/users/contollers.js';
import { errorHandler } from './error.handler.js';

import { 
  getConversationsFromUserId, 
  getMessagesFromConversationId, 
  createConversation 
} from './endpoints/conversations/contollers.js';

import { conversationCompletionController } from './endpoints/conversation-completion/controller.js';


// Configuration
const envScheme = zod.object({
  PORT : zod.string(),
  PG_DATABASE_URL : zod.url(),
  LLM_PROVIDER : zod.string(),
  LLM_MODEL : zod.string(),
  LLM_KEY : zod.string(),
});

dotenv.config();

try {
  envScheme.parse(process.env);
} catch (error: unknown) {
  if (error instanceof ZodError) {
    console.error('Fichier de variables d\'environnement invalide:');
    console.error(error.issues.map(issue => `${issue.path} : ${issue.message}`));
    process.exit();
  }
}


// Base de données
if (process.env.NODE_ENV !== 'test') {
  await initDatabase();
}


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
server.post('/conversations/:conversationId/messages:complete', conversationCompletionController);


// Gestion de toutes les expceptions envoyées depuis les controlleurs (synchrones et asynchrones)
server.use(errorHandler);


// Serveur - Lancement
if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));
}

export { server }; // Pour les tests unitaires