import { SequelizeBaseModel, type EntryMapper } from './sequelize-base-model.js';
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


type UserEntry = {
  id: number,
  username: string,
  password: string
};

type AddUserEntry = {
  username: string,
  password: string
};

class UserEntryMapper implements EntryMapper<UserEntry, AddUserEntry> {
  create(row: object) : UserEntry {

    return {
      id: ('id' in row && typeof row.id === 'number') ? row.id : 0,
      username: ('username' in row && typeof row.username === 'string') ? row.username : '',
      password: ('password' in row && typeof row.password === 'string') ? row.password : ''
    };
  }
}


type Query = Record<string, unknown>;
type UserId = number;


export class UserModel extends SequelizeBaseModel<UserEntry, number, AddUserEntry>  {

  constructor(client: Sequelize) {
    super(client, new UserEntryMapper());
  }

  init(): void {
    this.model = this.client.define(
      'User',
      {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
      },
      {
        tableName: 'user'
      }
    );
  }
};
