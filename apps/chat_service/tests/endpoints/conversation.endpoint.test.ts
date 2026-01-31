import server from '../../src/server.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import database from '../../src/database/client.js';


describe('/conversations', () => {

  let userId : number | undefined;
  let resUser : any;
  let conversationId : any;

  it('prep', async () => {
    await database.client.clearTablesContent();
    resUser = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    userId = resUser.body.id;
  });

  it('POST /conversations', async () => {   
    const res1 = await request(server.app).post('/conversations').send({ user_id: resUser.body.id, title: 'conversation de bobby' }).set('Content-Type', 'application/json');
    conversationId = res1.body.id;

    assert.strictEqual(res1.status, StatusCodes.CREATED);
    assert.notEqual(res1.body.id, undefined);
    assert.strictEqual(res1.body.title, 'conversation de bobby');
    assert.strictEqual(res1.body.user_id, userId);
  });

  it('GET /users/:userId/conversation', async () => {
    const res1 = await request(server.app).get(`/users/${userId}/conversations`);
    assert.strictEqual(res1.status, StatusCodes.OK);
    assert.strictEqual(res1.body.length, 1);
    assert.strictEqual(res1.body[0].id, conversationId);
    assert.strictEqual(res1.body[0].title, 'conversation de bobby');
    assert.strictEqual(res1.body[0].user_id, userId);
  });

  it('DELETE /conversations/', async () => {   
    const res1 = await request(server.app).delete(`/conversations/${conversationId}`);
    assert.strictEqual(res1.status, StatusCodes.OK);
  });

  it('unprep', async () => {
    const res1 = await request(server.app).delete('/users/bobby');
  });
});


describe('/conversations/:conversationId/messages:complete', () => {

  let userId : number | undefined;
  let resUser : any;
  let conversationId : any;
  let assistantResponseMessageId : any;

  it('prep POST /users', async () => {
    resUser = await request(server.app).post('/users').send({ username: 'bobby', password: 'bobby' }).set('Content-Type', 'application/json');
    userId = resUser.body.id;
  });

  it('prep POST /conversations', async () => {   
    const res1 = await request(server.app).post('/conversations').send({ user_id: resUser.body.id, title: 'conversation de bobby' }).set('Content-Type', 'application/json');
    conversationId = res1.body.id;

    assert.strictEqual(res1.status, StatusCodes.CREATED);
    assert.notEqual(res1.body.id, undefined);
    assert.strictEqual(res1.body.title, 'conversation de bobby');
    assert.strictEqual(res1.body.user_id, userId);
  });

  it ('POST /conversations/:conversationId/messages', async () => {
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages`)
      .send({ 
        role: 'user',
        content: 'Quelle est la couleur du ciel en un mot ?'
      })
      .set('Content-Type', 'application/json');

    assert.strictEqual(res.statusCode, StatusCodes.CREATED);
    assert.ok(!isNaN(Number(res.body.id)));
    assert.strictEqual(res.body.role, 'user');
    assert.strictEqual(res.body.content, 'Quelle est la couleur du ciel en un mot ?');
  });
  
  it('POST /conversations/:conversationId/messages:complete (single)', async () => {  
    const res = await request(server.app)
    .post(`/conversations/${conversationId}/messages:complete`)
    .send({ stream: false })
    .set('Content-Type', 'application/json');
    
    assert.strictEqual(res.status, StatusCodes.OK);
    assert.strictEqual(res.body.choices[0].message.role, 'assistant');
    assert.strictEqual(typeof res.body.choices[0].message.content, 'string');
    assert.ok(!isNaN(Number(res.body.id)));
    assistantResponseMessageId = res.body.id;
  });

  it('GET /conversations/:conversationId/messages', async () => {  
    const res = await request(server.app).get(`/conversations/${conversationId}/messages`);
    assert.strictEqual(res.status, StatusCodes.OK);
    assert.strictEqual(res.body[0].role, 'user');
    assert.strictEqual(res.body[0].content, 'Quelle est la couleur du ciel en un mot ?');
    assert.strictEqual(res.body[1].role, 'assistant');
    assert.strictEqual(typeof res.body[1].content, 'string');
  });

  it ('DELETE /messages', async () => {
    const res = await request(server.app).delete(`/messages/${assistantResponseMessageId}`);
    //assert.strictEqual(res.statusCode, StatusCodes.NO_CONTENT);
  });


  it('POST /conversations/:conversationId/messages:complete (stream)', async () => {  
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages:complete`)
      .send({ 
        messages: [{ role: 'user', content: 'Quelle est la couleur du ciel en un mot ?'}],
        stream: true 
      })
      .set('Content-Type', 'application/json');
    
    assert.strictEqual(res.status, StatusCodes.OK);
    assert.strictEqual(res.headers['content-type'], 'text/event-stream');
    const matches = res.text.matchAll(/data:(.+)\n\n/g);
    for (const match of matches) {
      if (!match[1].includes('[DONE]')) {
        const json = JSON.parse(match[1]);
        assert.strictEqual(json.choices[0].delta.role, 'assistant');
      }
    }
  });

});
