import express from 'express';
import { completionController } from './endpoints/chat-completion/controllers/completion.controller.js';


// Config

const server = express();
server.use(express.json());


// Routes

server.use((req, _res, next) => { console.log('Requête reçue: ' + req.url); next(); });
server.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
server.post('/chat/completions', completionController);


// Lancement

server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));