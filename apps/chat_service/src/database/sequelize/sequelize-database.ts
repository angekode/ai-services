// Sequelize
import { Sequelize } from 'sequelize';
import { 
  BaseError as SequelizeBaseError,
  DatabaseError as SequelizeDatabaseError, 
  ConnectionError as SequelizeConnectionError
} from 'sequelize';

// Database
import type { DatabaseInterface } from "../interfaces/database.interface.js";
import { DatabaseError, ConnectionDatabaseError } from '../interfaces/database-errors.js';

// Models
import { ConversationModel } from './conversation.model.js';
import { MessageModel } from './message.model.js';
import { UserModel } from "./user.model.js";


/**
 * Toutes les erreurs Sequelize sont converties en erreurs hérités de DatabaseError
 * pour présenter des erreurs identiques quels que soit l'ORM qui implémente
 * la classe DatabaseInterface.
 * Les erreurs classique JavaScript (hérités de Error) sont transmises.
 * Les erreurs inconnues sont converties en Error()
 * 
 * Error
 * └── BaseError
 *     └── SequelizeError
 *         ├── ConnectionError
 *         │   ├── ConnectionRefusedError
 *         │   ├── AccessDeniedError
 *         │   ├── HostNotFoundError
 *         │   ├── HostNotReachableError
 *         │   ├── InvalidConnectionError
 *         │   └── ConnectionAcquireTimeoutError
 *         │
 *         ├── DatabaseError
 *         │   └── SequelizeDatabaseError
 * 
 */
function filterAndConvertError(error: unknown): DatabaseError | Error {
  // Erreurs de connexion
  if (error instanceof SequelizeDatabaseError) {
    return new ConnectionDatabaseError(error.message);
  }
  if (error instanceof SequelizeConnectionError) {
    return new ConnectionDatabaseError(error.message);
  }
  // Erreurs de Sequelize autres
  if (error instanceof SequelizeBaseError) {
    return new DatabaseError(error.message);
  }
  // On transmet les erreurs classiques Javascript
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}


/**
 * Implémentation qui utilise Sequelize.
 */
export class SequelizeDatabase implements DatabaseInterface {

  #client : Sequelize | undefined;
  userModel : UserModel | undefined;
  conversationModel: ConversationModel | undefined;
  messageModel: MessageModel | undefined;


  /**
   * Vérifie l'accès à la base de donnée et reste connecté.
   * A appeler avant tout autre fonction.
   * Nécessite la variable d'environnement PG_DATABASE_URL.
   */
  async connect() {
    try {

      if (!process.env.PG_DATABASE_URL) {
        throw new Error('Url de la base de donnée undefined');
      }
      // Configuration interne à Sequelize, aucune connexion ici
      this.#client = new Sequelize(process.env.PG_DATABASE_URL, {
        define: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        },
        logging: false
      });
      
      // Valide le réseau, les droits, et teste une requête vers la base de donnée
      // Peux lever une exception
      await this.#client.authenticate();
      console.log('Connexion à la base de donnée OK');

    } catch(error) {
      throw filterAndConvertError(error);
    }
  }


  /**
   * Lis les schémas de table sans agir sur la base de données.
   * A appeller avant `createTables`.
   */
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


  /**
   * Crée les tables dans la base de données. 
   * Ecrase l'ancienne disposition des tables et leur contenu.
   */
  async createTables() {
    if (!this.#client) {
      throw new Error('Client sequelize non défini, il faut appeler connect() avant');
    }
    try {
      await this.#client.sync({ force: true });
    } catch(error) {
      throw filterAndConvertError(error);
    }
  }


  /**
   * Efface le contenu des tables sans changer leur structure.
   */
  async clearTablesContent() {
    // Ces fonctions renvoient déjà des exceptions au format ModelError
    await this.messageModel?.removeAllEntries();
    await this.conversationModel?.removeAllEntries();
    await this.userModel?.removeAllEntries();
  }


  /**
   * Ferme la connexion à la base de donnée. Les autres méthodes lanceront 
   * une exceptions si elles sont appelées ensuite.
   */
  async close() {
    try {
      await this.#client?.close();
    } catch(error) {
      throw filterAndConvertError(error);
    }
  }
};
