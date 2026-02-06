import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'node:test';
import assert, { Assert } from 'node:assert';
import database from '../../src/database/client.js';


describe('GET /users', () => {

  it('retourne un tableau vide', async () => {
    // Act 
    const response = await fetch(`${process.env.API_URL}/users`);
    const body = await response.json();

    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body)); 
    assert.strictEqual(body.length, 0);
  });
  

  it('retourne tous les utilisateurs', async () => {
    // Arrange
    const user1 = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const user2 = await database.client.userModel?.addEntry({ username: "Alice", password: "password" });

    // Act 
    const response = await fetch(`${process.env.API_URL}/users`);
    const body = await response.json();

    // Assert
    assert.strictEqual(response.status, StatusCodes.OK);
    assert.ok(Array.isArray(body)); 
    assert.strictEqual(body.length, 2);
    assert.notStrictEqual(body[0].id, undefined);
    assert.notStrictEqual(body[1].id, undefined);
    assert.strictEqual(body[0].username, user1?.username);
    assert.strictEqual(body[1].username, user2?.username);
    assert.strictEqual(body[0].password, undefined);
    assert.strictEqual(body[1].password, undefined);
  });
});


describe('POST /users', () => {

  it('crée un user', async () => {
    // Act 
    const response = await fetch(
      `${process.env.API_URL}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Bob', password: 'password' })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.notStrictEqual(Number(body.id), NaN);
    assert.strictEqual(body.username, 'Bob');
    assert.strictEqual(body.password, undefined);
  });
  
  
  it('entrée invalide', async () => {
    // Act
    const response = await fetch(
      `${process.env.API_URL}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'Bod', password: 'password' })
      }
    );
    const body = await response.json();
    
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });
});


describe('DELETE /users', () => {
  
  it('supprime un user', async () => {
    // Arrange
    const user1 = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    
    // Act 
    const response = await fetch(`${process.env.API_URL}/users/${user1?.id}`, { method: 'DELETE' });
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NO_CONTENT);
  });
  
  
  it('id user invalide', async () => {
    // Arrange
    const user1 = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    
    // Act 
    const response = await fetch(`${process.env.API_URL}/users/af15`, { method: 'DELETE' });
    const body = await response.json();
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });  
  
  
  it('id user inconnu', async () => {
    // Arrange
    const user1 = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    
    // Act 
    const response = await fetch(`${process.env.API_URL}/users/75`, { method: 'DELETE' });
    const body = await response.json();
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });  
});
