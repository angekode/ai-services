import { LangchainLLMClient } from '../dist/index.js';

const client = new LangchainLLMClient();
const res = await client.infer(
  [{ role: 'user', content: 'Bonjour'}],
  process.env.PROVIDER as string,
  process.env.MODEL as string,
  { apiKey: process.env.KEY as string}
);

console.log(res);