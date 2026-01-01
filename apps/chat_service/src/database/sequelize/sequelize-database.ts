import { Sequelize } from 'sequelize';
import { type DatabaseInterface } from "../interfaces/interfaces.database.js";
import { UserModel } from "./user.model.js";
import { ConversationModel } from './conversation.model.js';


export class SequelizeDatabase implements DatabaseInterface {

  #client : Sequelize | undefined;
  userModel : UserModel | undefined;
  conversationModel: ConversationModel | undefined;

  async connect() {
    if (!process.env.PG_DATABASE_URL) {
      throw new Error('Url de la base de donnée undefined');
    }
    this.#client = new Sequelize(process.env.PG_DATABASE_URL, {
      define: {
        createdAt: "created_at",
        updatedAt: "updated_at"
      },
      logging: false
    });

    await this.#client.authenticate();
    console.log('Connexion à la base de donnée OK');
  }

  async createModels() {
    if (!this.#client) {
      throw new Error('Client sequelize non défini, il faut appeler connect() avant');
    }
    this.userModel = new UserModel(this.#client);
    this.userModel.init();
    this.conversationModel = new ConversationModel(this.#client);
    this.conversationModel.init();
  }

  async createTables() {
    if (!this.#client) {
      throw new Error('Client sequelize non défini, il faut appeler connect() avant');
    }
    await this.#client.sync({ force: true });
  }

  async seedTables(): Promise<void> {
    await this.userModel?.model?.create({ username: 'Nico', password: 'rocket' });
    await this.userModel?.model?.create({ username: 'Chris', password: 'pass' });
    await this.conversationModel?.model?.create({ title: 'Les chats', user_id: 1 });
    await this.conversationModel?.model?.create({ title: 'Les Avengers', user_id: 2 });
  }
};
