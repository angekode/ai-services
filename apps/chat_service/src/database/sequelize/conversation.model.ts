import { SequelizeBaseModel, type EntryMapper } from './sequelize-base-model.js';
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


type ConversationEntry = {
  id: number,
  title: string,
  user_id: number,
  created_at: string
};

type AddConversationEntry = {
  title: string,
  user_id: number
};

type RemoveConversationEntry = {
  id: number
};

type UpdateConversationEntry = {
  title?: string,
  user_id?: number
};

class ConversationEntryMapper implements EntryMapper<ConversationEntry, AddConversationEntry> {
  create(row: object) : ConversationEntry {

    return {
      id: ('id' in row && typeof row.id === 'number') ? row.id : 0,
      title: ('title' in row && typeof row.title === 'string') ? row.title : '',
      user_id: ('user_id' in row && typeof row.user_id === 'number') ? row.user_id : -1,
      created_at: ('created_at' in row && typeof row.created_at === 'string') ? row.created_at : '',
    };
  }
}


type Query = Record<string, unknown>;
type UserId = number;


export class ConversationModel extends SequelizeBaseModel<ConversationEntry, number, AddConversationEntry, RemoveConversationEntry, UpdateConversationEntry>  {

  constructor(client: Sequelize) {
    super(client, new ConversationEntryMapper());
  }

  init(): void {
    this.model = this.client.define(
      'Conversation',
      {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },
      {
        tableName: 'conversation'
      }
    );
  }
};
