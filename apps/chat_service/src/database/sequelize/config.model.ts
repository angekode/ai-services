import { SequelizeBaseModel, type EntryMapper } from './sequelize-base-model.js';
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


type ConfigEntry = {
  id: number,
  username: string,
  password: string
};

type AddConfigEntry = {
  username: string,
  password: string
};

class ConfigEntryMapper implements EntryMapper<ConfigEntry, AddConfigEntry> {
  create(row: object) : ConfigEntry {

    return {
      id: ('id' in row && typeof row.id === 'number') ? row.id : 0,
      username: ('username' in row && typeof row.username === 'string') ? row.username : '',
      password: ('password' in row && typeof row.password === 'string') ? row.password : ''
    };
  }
}


type Query = Record<string, unknown>;
type UserId = number;


export class UserModel extends SequelizeBaseModel<ConfigEntry, number, AddConfigEntry>  {

  constructor(client: Sequelize) {
    super(client, new ConfigEntryMapper());
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
