import express from 'express';
import { completionController } from './endpoints/chat-completion/controllers/completion.controller.js';
import { SequelizeDatabase } from './database/sequelize/sequelize-database.js';


// Database
const db = new SequelizeDatabase();
await db.connect();
await db.createModels();

const row = await db.userModel?.getAllEntries();
const users = await db.userModel?.getEntries({ username: 'Nico' });
const user = await db.userModel?.getFirstEntry({ username: 'Nico' });
const newUser = await db.userModel?.addEntry({ username: 'Chris', password: 'Chris' });


// Serveur
const server = express();
server.use(express.json());


// Serveur - Routes
server.use((req, _res, next) => { console.log('Requête reçue: ' + req.url); next(); });
server.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
server.post('/chat/completions', completionController);


// Serveur - Lancement
server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));