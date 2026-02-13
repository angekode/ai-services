import environment from './environment.js';
import database from './database/client.js';
import server from './server.js';


// Environnement
try {
  environment.init();
  console.log('Environnement chargé avec succés');
} catch (error: unknown) {
  console.error(error instanceof Error ? console.error(error.message) : String(error));
  process.exit(0);
}


// Base de données
if (process.env.NODE_ENV !== 'test') {
  await database.init();
  console.log('Base de données initialisée avec succés');
}


// Serveur
server.init();
if (process.env.NODE_ENV !== 'test') {
  server.run();
  console.log('Serveur lancé avec succés');
}

export { server }; // Pour les tests unitaires