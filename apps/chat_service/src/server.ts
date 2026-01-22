import express from 'express';
import mainRouter from './routes/main.router.js';
import { errorHandler } from './error.handler.js';
import cors from 'cors';


export default {

  app: express(),

  init() {
    
    this.app.use(cors());
    this.app.use(express.json());

    // Log
    this.app.use((req, _res, next) => { console.log('Requête reçue: ' + req.url); next(); });
    // Routes
    this.app.use(mainRouter);
    // Gestion de toutes les expceptions envoyées depuis les controlleurs (synchrones et asynchrones)
    this.app.use(errorHandler);
  },

  run() {
    this.app.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));
  }
};
