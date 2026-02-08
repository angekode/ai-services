import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'node:test';
import assert, { Assert } from 'node:assert';
import database from '../../src/database/client.js';


describe('GET /conversations', () => {

  it('retourne un tableau vide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/conversations`);
    const body = await response.json();

    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body)); 
    assert.strictEqual(body.length, 0);
  });
  

  it('retourne toutes les conversations', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });

    // Act 
    const response = await fetch(`${process.env.API_URL}/conversations`);
    const body = await response.json();

    // Assert
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body));
    assert.strictEqual(body.length, 1);
    assert.notStrictEqual(body[0].id, undefined);
    assert.strictEqual(body[0].title, conversation?.title);
    assert.strictEqual(body[0].user_id, user?.id);
  });
});


describe('POST /conversations', () => {

  it('crée une conversation', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });

    // Act 
    const response = await fetch(
      `${process.env.API_URL}/conversations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'titre', user_id: user!.id })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.ok(!isNaN(Number(body.id)));
    assert.strictEqual(body.title, 'titre');
    assert.strictEqual(body.user_id, user?.id);
  });
  
  
  it('entrée invalide', async () => {
    // Act
    const response = await fetch(
      `${process.env.API_URL}/conversations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'titre'})
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });
});


describe('DELETE /conversations/:id', () => {
  
  it('supprime une conversation', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "Bob", user_id: user!.id });
    
    // Act 
    const response = await fetch(`${process.env.API_URL}/conversations/${conversation?.id}`, { method: 'DELETE' });
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NO_CONTENT);
  });
  
  
  it('id conversation invalide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/conversations/af15`, { method: 'DELETE' });
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });  
  
  
  it('id conversation inconnu', async () => {   
    // Act 
    const response = await fetch(`${process.env.API_URL}/conversations/75`, { method: 'DELETE' });
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });  
});



describe('PATCH /conversations/:id', () => {

  it('modifie une conversation', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "Bob", user_id: user!.id });

    // Act 
    const response = await fetch(
      `${process.env.API_URL}/conversations/${conversation?.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'nouveau titre', user_id: user!.id })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.strictEqual(body.title, 'nouveau titre');
    assert.strictEqual(body.user_id, user?.id);
  });
  
  
  it('entrée invalide', async () => {
    // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "Bob", user_id: user!.id });

    // Act
    const response = await fetch(
      `${process.env.API_URL}/conversations/${conversation?.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'titre'})
      }
    );
    const body = await response.json();
    
    // Assert
    // La conversation reste inchangée
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.strictEqual(body.title, conversation?.title);
    assert.strictEqual(body.user_id, conversation?.user_id);
  });
});