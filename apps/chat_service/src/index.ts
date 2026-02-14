import environment from './environment.ts';
import database from './database/client.ts';
import server from './server.ts';


// Environnement
try {
  environment.init();
  console.log('Environnement chargé avec succés');
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error));
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