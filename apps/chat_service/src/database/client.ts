import { SequelizeDatabase } from "./sequelize/sequelize-database.js";


export default {

  client: new SequelizeDatabase(),

  async init() {
    await this.client.connect();
    await this.client.createModels();
  },

  async close() {
  await this.client.close();
  }
};

