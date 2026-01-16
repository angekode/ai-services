import { SequelizeDatabase } from "./sequelize/sequelize-database.js";

const client = new SequelizeDatabase();

export async function initDatabase() {
  await client.connect();
  await client.createModels();
  await client.createTables();
  await client.seedTables();
}

export default client;
