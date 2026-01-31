import server  from '../../src/server.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import database from '../../src/database/client.js';


describe('/users', () => {
  it('prep', async () => {
    await database.client.clearTablesContent();
  });

  it('POST /users', async () => {
    const res1 = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    assert.equal(res1.statusCode, StatusCodes.CREATED);
    assert.notEqual(res1.body, undefined);
    assert.notEqual(res1.body.id, undefined);
    assert.equal(res1.body.username, 'bobby');
  });

  it('GET /users/bobby', async () => {
    const res1 = await request(server.app).get('/users/bobby');
    assert.equal(res1.statusCode, StatusCodes.OK);
    assert.notEqual(res1.body, undefined);
    assert.notEqual(res1.body.id, undefined);
    assert.equal(res1.body.username, 'bobby');
  });

  it('DELETE /users/bobby', async () => {
    const res1 = await request(server.app).delete('/users/bobby');
    assert.equal(res1.statusCode, StatusCodes.OK);
    assert.strictEqual(res1.body.removedCount, 1);
  });
});


