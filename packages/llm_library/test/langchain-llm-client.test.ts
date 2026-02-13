import { describe, it } from 'node:test';
import assert, { AssertionError } from 'node:assert';
import { LangchainLLMClient } from '../src/index.ts';


describe('LangchainLLMClient.infer()', () => {

  it('Retourne une réponse valide', async () => {

    const client = new LangchainLLMClient();
    const res = await client.infer(
      [{ role: 'user', content: 'Bonjour'}],
      process.env.PROVIDER as string,
      process.env.MODEL as string,
      { apiKey: process.env.KEY as string}
    );
    
    assert.strictEqual(res.type, 'message');
    //assert.notStrictEqual(res.id, undefined);
    assert.notStrictEqual(res.metadata, undefined);
    assert.ok(res.content.length > 0);
  });
});


describe('LangchainLLMClient.inferStream()', () => {
  
  it('Retourne une réponse valide', async () => {
    
    const client = new LangchainLLMClient();

    const stream = await client.inferStream(
      [{ role: 'user', content: 'Bonjour'}],
      process.env.PROVIDER as string,
      process.env.MODEL as string,
      { apiKey: process.env.KEY as string}
    );
    
    for await (const chunk of stream) {
      switch (chunk.type) {
        case 'message.delta': {
          assert.strictEqual(chunk.type, 'message.delta');
          //assert.notStrictEqual(chunk.id, undefined);
          assert.notStrictEqual(chunk.metadata, undefined);
          assert.ok(chunk.content.length > 0);
        } break;

        case 'message.done': break;
        case 'error': { assert.ok(false); } break;
      }
    }
  });
});

describe('LangchainLLMClient.embed() / .calculateSimilarity()', () => {

  it('Calcule la similarité', async () => {

    const client = new LangchainLLMClient();

    const vectors = await client.embed(
      [
        { content: "Les Red Hot Chili Peppers figurent parmi les groupes les plus emblématiques de la musique contemporaine.", metaData: {} },
        { content: "Les voies communales comprennent également des chemins ruraux, principalement utilisés pour l’accès aux exploitations agricoles, forêts ou hameaux isolés.", metaData: {} },
      ],
      process.env.EMB_PROVIDER as string,
      process.env.EMB_MODEL as string,
      { apiKey: process.env.EMB_KEY as string}
    );

    assert.ok(vectors.length > 0);
    for (const vector of vectors) {
      assert.ok(vector.length > 0);
    }

    const maxResultCounts = [1, 2];

    for (const maxResultCount of maxResultCounts) {

      const sims = await client.calculateSimilarity(
        "Les routes de france",
        vectors,
        process.env.EMB_PROVIDER as string,
        process.env.EMB_MODEL as string,
        { apiKey: process.env.EMB_KEY as string, maxResultCount }
      );

      assert.strictEqual(sims.length, maxResultCount);
      for (let i = 0; i < maxResultCount; i++) {
        assert.ok(sims[i]!.index >= 0 &&  sims[i]!.index < vectors.length);
        assert.ok(sims[i]!.similarity > 0 && sims[i]!.similarity < 1);
      }
    }
  });
});
