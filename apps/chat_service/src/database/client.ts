import { SequelizeDatabase } from "./sequelize/sequelize-database.js";

const client = new SequelizeDatabase();
client.connect();
await client.createModels();

export default client;
