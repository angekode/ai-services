import { SequelizeBaseModel, type EntryMapper } from './sequelize-base-model.js';
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


type MessageEntry = {
  id: number,
  role: string,
  content: string,
  conversation_id: number
};

type AddMessageEntry = {
  role: string,
  content: string,
  conversation_id: number
};

class MessageEntryMapper implements EntryMapper<MessageEntry, AddMessageEntry> {
  create(row: object) : MessageEntry {

    return {
      id: ('id' in row && typeof row.id === 'number') ? row.id : 0,
      role: ('role' in row && typeof row.role === 'string') ? row.role : '',
      content: ('content' in row && typeof row.content === 'string') ? row.content : '',
      conversation_id: ('conversation_id' in row && typeof row.conversation_id === 'number') ? row.conversation_id : -1,
    };
  }
}


type Query = Record<string, unknown>;
type UserId = number;


export class MessageModel extends SequelizeBaseModel<MessageEntry, number, AddMessageEntry>  {

  constructor(client: Sequelize) {
    super(client, new MessageEntryMapper());
  }

  init(): void {
    this.model = this.client.define(
      'Message',
      {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        conversation_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },
      {
        tableName: 'message'
      }
    );
  }
};
