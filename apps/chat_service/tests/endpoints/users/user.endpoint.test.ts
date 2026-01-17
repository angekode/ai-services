import { server } from '../../../src/index.js';
import database from '../../../src/database/client.js';
import request from 'supertest';

// Pour s'assurer que la base de données est initialisée avant les tests
beforeAll(async () => await database.init());

test('GET /users', async () => {
  const res1 = await request(server.app).get('/users/Nico');
  expect(res1.status).toBe(200);
  expect(res1.body.id).toBe(1);
  expect(res1.body.username).toBe('Nico');

  const res2 = await request(server.app).get('/users/Chris');
  expect(res2.status).toBe(200);
  expect(res2.body.id).toBe(2);
  expect(res2.body.username).toBe('Chris');
});

// Pour éviter le warning: "Jest did not exit one second after the test run has completed."
// Il faut arrêter toutes les fonctions asynchrones
afterAll(async () => await database.close());