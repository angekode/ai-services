import { SequelizeBaseModel, type EntryMapper } from './sequelize-base-model.js';
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


type MessageEntry = {
  id: number,
  role: string,
  content: string,
  conversation_id: number,
  created_at: string
};

type AddMessageEntry = {
  role: string,
  content: string,
  conversation_id: number
};

type RemoveMessageEntry = {
  id: number
};

type UpdateMessageEntry = {
  role?: string,
  content?: string,
  conversation_id?: number
};

class MessageEntryMapper implements EntryMapper<MessageEntry, AddMessageEntry> {
  create(row: object) : MessageEntry {

    return {
      id: ('id' in row && typeof row.id === 'number') ? row.id : 0,
      role: ('role' in row && typeof row.role === 'string') ? row.role : '',
      content: ('content' in row && typeof row.content === 'string') ? row.content : '',
      conversation_id: ('conversation_id' in row && typeof row.conversation_id === 'number') ? row.conversation_id : -1,
      created_at: ('created_at' in row && row.created_at instanceof Date) ? row.created_at.toISOString() : '',
    };
  }
}


type Query = Record<string, unknown>;
type UserId = number;


export class MessageModel extends SequelizeBaseModel<MessageEntry, number, AddMessageEntry, RemoveMessageEntry, UpdateMessageEntry>  {

  constructor(client: Sequelize) {
    super(client, new MessageEntryMapper());
  }

  init(): void {
    this.model = this.client.define(
      'Message',
      {
        role: {
            type: DataTypes.STRING,
            allowNull: false
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
