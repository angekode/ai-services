import { before, beforeEach, after } from 'node:test';
import database from '../src/database/client.js';
import server from '../src/server.js';

before(async () => {
  await database.init();
  await database.client.createTables();
});

beforeEach(async () => {
  await database.client.clearTablesContent();
});

after(async () => await database.close());