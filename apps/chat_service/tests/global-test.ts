import { before, beforeEach, after } from 'node:test';
import database from '../src/database/client.ts';
import server from '../src/server.ts';

before(async () => {
  await database.init();
  await database.client.createTables();
});

beforeEach(async () => {
  await database.client.clearTablesContent();
});

after(async () => await database.close());