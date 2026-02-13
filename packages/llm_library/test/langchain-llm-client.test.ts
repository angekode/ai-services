import { LangchainLLMClient } from '../dist/index.ts';

const client = new LangchainLLMClient();
const res = await client.infer(
  [{ role: 'user', content: 'Bonjour'}],
  process.env.PROVIDER as string,
  process.env.MODEL as string,
  { apiKey: process.env.KEY as string}
);

console.log(res);

const stream = await client.inferStream(
  [{ role: 'user', content: 'Bonjour'}],
  process.env.PROVIDER as string,
  process.env.MODEL as string,
  { apiKey: process.env.KEY as string}
);

for await (const chunk of stream) {
  console.log(chunk);
}

const vectors = await client.embed(
  [
    { content: "Les Red Hot Chili Peppers figurent parmi les groupes les plus emblématiques de la musique contemporaine.", metaData: {} },
    { content: "Les voies communales comprennent également des chemins ruraux, principalement utilisés pour l’accès aux exploitations agricoles, forêts ou hameaux isolés.", metaData: {} },
  ],
  process.env.EMB_PROVIDER as string,
  process.env.EMB_MODEL as string,
  { apiKey: process.env.EMB_KEY as string}
);

const sims = await client.calculateSimilarity(
  "Les routes de france",
  vectors, 
  process.env.EMB_PROVIDER as string,
  process.env.EMB_MODEL as string,
  { apiKey: process.env.EMB_KEY as string, maxResultCount: 1 }
);

console.log(sims);