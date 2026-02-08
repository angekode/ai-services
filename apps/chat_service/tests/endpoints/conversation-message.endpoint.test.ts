import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StatusCodes } from 'http-status-codes';
import database from '../../src/database/client.js';


describe('GET /conversations/:conversationId/messages', () => {
  it('conversation inexistante', async () => {
    // Act
    const response = await fetch(`http://localhost:3001/conversations/9869/messages`);
    // Assert 
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });

  it('retourne un tableau vide', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    
    // Act
    const response = await fetch(`http://localhost:3001/conversations/${conversation?.id}/messages`);
    const body = await response.json();
    
    // Assert 
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body));
    assert.strictEqual(body.length, 0);
  });

  it('retourne un tableau de messages', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry({ role: "user", content: "contenu du message", conversation_id: conversation!.id });
    
    // Act
    const response = await fetch(`http://localhost:3001/conversations/${conversation?.id}/messages`);
    const body = await response.json();
    
    // Assert 
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body));
    assert.strictEqual(body.length, 1);
    assert.strictEqual(body[0].id, message?.id);
    assert.strictEqual(body[0].role, message?.role);
    assert.strictEqual(body[0].content, message?.content);
    assert.strictEqual(body[0].conversation_id, message?.conversation_id);
  });
});


describe('POST /conversations/:conversationId/messages', () => {
  it('conversation inexistante', async () => {
    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/9869/messages`, 
      { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: 'contxxxenu' })
      });
    // Assert 
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });


  it('format invalide', async () => {
   // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });

    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/${conversation?.id}/messages`, 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'dummy' })
      }
    );

    // Assert 
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });


    it('crée un message', async () => {
   // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });

    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/${conversation?.id}/messages`, 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: 'contenu' })
      }
    );

    const body = await response.json();

    // Assert 
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.ok(!isNaN(body.id));
    assert.strictEqual(body.role, 'user');
    assert.strictEqual(body.content, 'contenu');
    assert.strictEqual(body.conversation_id, conversation?.id);
  });
});

