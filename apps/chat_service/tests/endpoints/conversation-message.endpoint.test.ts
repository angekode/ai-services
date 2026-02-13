import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StatusCodes } from 'http-status-codes';
import database from '../../src/database/client.ts';


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



describe('POST /conversations/:conversationId/messages:complete', () => {
  it('conversation inexistante', async () => {
    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/9869/messages:complete`, 
      { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream: false })
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
      `http://localhost:3001/conversations/${conversation?.id}/messages:complete`, 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'dummy' })
      }
    );

    // Assert 
    assert.strictEqual(response.status, StatusCodes.BAD_REQUEST);
  });


  it('génère un message de réponse en non stream', async () => {
   // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry(
      { role: "user", content: "Quelle est la couleur du ciel en un mot ?", conversation_id: conversation!.id }
    );
    
    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/${conversation?.id}/messages:complete`, 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream: false })
      }
    );

    const body = await response.json();

    // Assert
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.ok(!isNaN(Number(body.id)));
    assert.strictEqual(body.choices[0].message.role, "assistant");
    assert.strictEqual(typeof body.choices[0].message.content, "string");
  });


    it('génère un message de réponse stream', async () => {
   // Arrange
    const user = await database.client.userModel?.addEntry({ username: "Bob", password: "password" });
    const conversation = await database.client.conversationModel?.addEntry({ title: "titre", user_id: user!.id });
    const message = await database.client.messageModel?.addEntry(
      { role: "user", content: "Quelle est la couleur du ciel en un mot ?", conversation_id: conversation!.id }
    );
    
    // Act
    const response = await fetch(
      `http://localhost:3001/conversations/${conversation?.id}/messages:complete`, 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream: true })
      }
    );
    const streamedBody = await response.text();
    const dataMatches = streamedBody.matchAll(/data:\s(.+)\n\n/g);
    
    // Assert
    assert.strictEqual(response.status, StatusCodes.CREATED);
    assert.strictEqual(response.headers.get('Content-Type'), 'text/event-stream');
    for (const dataMatch of dataMatches) {
      const data = dataMatch[1];
      if (data.trim() === '[DONE]') {
        break;
      }
      const json = JSON.parse(data);
      assert.ok(!isNaN(Number(json.id)));
      assert.strictEqual(json.choices[0].delta.role, "assistant");
      assert.strictEqual(typeof json.choices[0].delta.content, "string");
    }
  });
});

