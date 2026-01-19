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

describe('/conversations', () => {

  let userId : number | undefined;
  let resUser : any;
  let conversationId : any;

  it('prep', async () => {
    resUser = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    userId = resUser.body.id;
  });

  it('POST /conversations', async () => {   
    const res1 = await request(server.app).post('/conversations').send({ user_id: resUser.body.id, title: 'conversation de bobby' }).set('Content-Type', 'application/json');
    conversationId = res1.body.id;

    expect(res1.status).toBe(StatusCodes.CREATED);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.title).toBe('conversation de bobby');
    expect(res1.body.user_id).toBe(userId);
  });

  it('GET /users/:userId/conversation', async () => {
    const res1 = await request(server.app).get(`/users/${userId}/conversations`);
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.length).toBe(1);
    expect(res1.body[0].id).toBe(conversationId);
    expect(res1.body[0].title).toBe('conversation de bobby');
    expect(res1.body[0].user_id).toBe(userId);
  });

  it('DELETE /conversations/', async () => {   
    const res1 = await request(server.app).delete(`/conversations/${conversationId}`);
    expect(res1.status).toBe(StatusCodes.OK);
  });

  it('unprep', async () => {
    const res1 = await request(server.app).delete('/users/bobby');
  });
});


describe('/conversations/:conversationId/messages:complete', () => {

  let userId : number | undefined;
  let resUser : any;
  let conversationId : any;

  it('prep POST /users', async () => {
    resUser = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    userId = resUser.body.id;
  });

  it('prep POST /conversations', async () => {   
    const res1 = await request(server.app).post('/conversations').send({ user_id: resUser.body.id, title: 'conversation de bobby' }).set('Content-Type', 'application/json');
    conversationId = res1.body.id;

    expect(res1.status).toBe(StatusCodes.CREATED);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.title).toBe('conversation de bobby');
    expect(res1.body.user_id).toBe(userId);
  });

  it('POST /conversations/:conversationId/messages:complete (single)', async () => {  
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages:complete`)
      .send({ 
        messages: [{ role: 'user', content: 'Quelle est la couleur du ciel en un mot ?'}],
        stream: false 
      })
      .set('Content-Type', 'application/json');
    
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.choices[0].message.role).toBe('assistant');
      expect(typeof res.body.choices[0].message.content).toBe('string');
  });

  it('GET /conversations/:conversationId/messages', async () => {  
    const res = await request(server.app).get(`/conversations/${conversationId}/messages`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body[0].role).toBe('user');
    expect(res.body[0].content).toBe('Quelle est la couleur du ciel en un mot ?');
    expect(res.body[1].role).toBe('assistant');
    expect(typeof res.body[1].content).toBe('string');
  });

  it('POST /conversations/:conversationId/messages:complete (stream)', async () => {  
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages:complete`)
      .send({ 
        messages: [{ role: 'user', content: 'Quelle est la couleur du ciel en un mot ?'}],
        stream: true 
      })
      .set('Content-Type', 'application/json');
    
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.headers['content-type']).toBe('text/event-stream');
    const matches = res.text.matchAll(/data:(.+)\n\n/g);
    for (const match of matches) {
      if (!match[1].includes('[DONE]')) {
        const json = JSON.parse(match[1]);
        expect(json.choices[0].delta.role).toBe('assistant');
      }
    }
  });

});


// Pour éviter le warning: "Jest did not exit one second after the test run has completed."
// Il faut arrêter toutes les fonctions asynchrones
afterAll(async () => await database.close());