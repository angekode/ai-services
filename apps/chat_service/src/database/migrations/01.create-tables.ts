import { SequelizeDatabase } from "../sequelize/sequelize-database.js";

const client = new SequelizeDatabase();
await client.connect();
await client.createModels();
await client.createTables();
await client.close();