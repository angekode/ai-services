import { Sequelize } from 'sequelize';
import { type DatabaseInterface } from "../interfaces/interfaces.database.js";
import { UserModel } from "./user.model.js";
import { ConversationModel } from './conversation.model.js';
import { MessageModel } from './message.model.js';

export class SequelizeDatabase implements DatabaseInterface {

  #client : Sequelize | undefined;
  userModel : UserModel | undefined;
  conversationModel: ConversationModel | undefined;
  messageModel: MessageModel | undefined;

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
    this.messageModel = new MessageModel(this.#client);
    this.messageModel.init();
  }

  async createTables() {
    if (!this.#client) {
      throw new Error('Client sequelize non défini, il faut appeler connect() avant');
    }
    await this.#client.sync({ force: true });
  }

  async close() {
    await this.#client?.close();
  }
};
