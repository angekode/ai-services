import { server } from '../../../src/index.js';
import { initDatabase, closeDatabase } from '../../../src/database/client.js';
import request from 'supertest';

// Pour s'assurer que la base de données est initialisée avant les tests
beforeAll(async () => await initDatabase());

test('GET /users', async () => {
  const res = await request(server).get('/users/Nico');
  expect(res.status).toBe(200);

});

// Pour éviter le warning: "Jest did not exit one second after the test run has completed."
// Il faut arrêter toutes les fonctions asynchrones
afterAll(async () => await closeDatabase());