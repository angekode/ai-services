import { SequelizeDatabase } from "../sequelize/sequelize-database.js";
import environment from "../../environment.ts";


environment.init();

const client = new SequelizeDatabase();
await client.connect();
await client.createModels();
await client.createTables();
await client.close();