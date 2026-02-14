import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'node:test';
import assert, { Assert } from 'node:assert';
import database from '../../src/database/client.ts';


describe('GET /messages', () => {

  it('retourne un tableau vide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages`);
    const body = await response.json();

    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body)); 
    assert.strictEqual(body.length, 0);
  });
  

  it('retourne tous les messages', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry({ role: "user", content: "contenu du message", conversation_id: conversation!.id });

    // Act 
    const response = await fetch(`${process.env.API_URL}/messages`);
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


describe('POST /messages', () => {

  it('crée un message', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });

    // Act
    const response = await fetch(
      `${process.env.API_URL}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: "user", content: "contenu du message", conversation_id: conversation!.id })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.notStrictEqual(body, undefined);
    assert.ok(!isNaN(body.id));
    assert.strictEqual(body.role, 'user');
    assert.strictEqual(body.content, 'contenu du message');
    assert.strictEqual(body.conversation_id, conversation!.id);
  });
  
  
  it('entrée invalide', async () => {
    // Act
    const response = await fetch(
      `${process.env.API_URL}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'dummy' })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });
});


describe('DELETE /messages/:id', () => {
  
  it('supprime un message', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry({ role: "user", content: "contenu du message", conversation_id: conversation!.id });

    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/${message?.id}`, { method: 'DELETE' });
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NO_CONTENT);
  });
  
  
  it('id user invalide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/af15`, { method: 'DELETE' });
    const body = await response.json();
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });  
  
  
  it('id user inconnu', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/1519`, { method: 'DELETE' });
    const body = await response.json();
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });  
});


describe('GET /messages/:id', () => {
  
  it('message non existant', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/15198`);
    // Assert
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });


  it('id message invalide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/affaf`);
    // Assert
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });


  it('retourne un message', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry({ role: "user", content: "contenu du message", conversation_id: conversation!.id });
 
    // Act 
    const response = await fetch(`${process.env.API_URL}/messages/${message?.id}`);
    const body = await response.json();
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.strictEqual(body.id, message?.id);
    assert.strictEqual(body.role, message?.role);
    assert.strictEqual(body.content, message?.content);
    assert.strictEqual(body.conversation_id, message?.conversation_id);
  });
});

