import { SequelizeDatabase } from "./sequelize/sequelize-database.js";

const client = new SequelizeDatabase();
client.connect();
await client.createModels();
await client.createTables();
await client.seedTables();

export default client;
