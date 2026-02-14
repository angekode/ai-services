import express from 'express';
import { handleCompletionRequest } from './controllers/completion.controller.ts';
import { validateChatCompletionHeader, validateChatCompletionBody } from './controllers/validation.controller.ts';
import { handleError } from './middleware/error.middleware.ts';


// Config

const server = express();
server.use(express.json());


// Routes

server.use((req, _res, next) => { console.log('Requête reçue: ' + req.url); next(); });

server.get('/', (_req, res) => res.send('Serveur à l\'écoute'));

server.post(
  '/chat/completions',
  validateChatCompletionHeader,
  validateChatCompletionBody,
  handleCompletionRequest
);
server.use(handleError);

// Lancement

server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));
