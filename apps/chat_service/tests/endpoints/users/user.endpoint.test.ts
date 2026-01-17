import { server } from '../../../src/index.js';
import database from '../../../src/database/client.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it } from '@jest/globals';

// Pour s'assurer que la base de données est initialisée avant les tests
beforeAll(async () => await database.init());

describe('/users', () => {
  it('POST /users', async () => {
    const res1 = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    expect(res1.status).toBe(StatusCodes.CREATED);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.username).toBe('bobby');
  });

  it('GET /users/bobby', async () => {
    const res1 = await request(server.app).get('/users/bobby');
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.username).toBe('bobby');
  });

  it('DELETE /users/bobby', async () => {
    const res1 = await request(server.app).delete('/users/bobby');
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.removedCount).toBe(1);
  });
});

// Pour éviter le warning: "Jest did not exit one second after the test run has completed."
// Il faut arrêter toutes les fonctions asynchrones
afterAll(async () => await database.close());