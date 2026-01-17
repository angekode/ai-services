import { SequelizeDatabase } from "./sequelize/sequelize-database.js";

const client = new SequelizeDatabase();

export async function initDatabase() {
  await client.connect();
  await client.createModels();
}

export async function closeDatabase() {
  await client.close();
}

export default client;
