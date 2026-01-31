import { before, beforeEach, after } from 'node:test';
import database from '../src/database/client.js';
import server from '../src/server.js';

before(async () => {
  server.init();  
  await database.init();
  await database.client.createTables();
});

after(async () => await database.close());