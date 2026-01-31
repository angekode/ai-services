import { type ModelInterface } from "../interfaces/interfaces.database.js";
import { DataTypes, type ModelStatic, Model, Sequelize } from "sequelize";


export type SequelizeQuery = Record<string, unknown>;

export interface EntryMapper<TEntry, TAddEntry>  {
  create(row: object): TEntry;
};


export class SequelizeBaseModel<TEntry, TId, TAddEntry, TRemoveEntry> implements ModelInterface<TEntry, SequelizeQuery, TId, TAddEntry, TRemoveEntry> {

  protected client : Sequelize;
  model: ModelStatic<Model> | undefined;
  #mapper: EntryMapper<TEntry, TAddEntry>;

  constructor(client: Sequelize, mapper: EntryMapper<TEntry, TAddEntry>) {
    this.client = client;
    this.#mapper = mapper;
  }

  init(): void {} // a override

  async getAllEntries(): Promise<TEntry[]> {
    const entries = await this.model?.findAll({ raw: true });
    return entries?.map(e => this.#mapper.create(e)) ?? [];
  }

  async getEntries(query: SequelizeQuery): Promise<TEntry[]> {
    const entries = await this.model?.findAll({ where : query, raw: true });
    return entries?.map(e => this.#mapper.create(e)) ?? [];
  }

  async getFirstEntry(query: SequelizeQuery): Promise<TEntry | null> {
    const entry = await this.model?.findOne({ where : query, raw: true });
    return entry ? this.#mapper.create(entry) : null;
  }
  
  async getEntryWithId(id: TId): Promise<TEntry> {
    return this.#mapper.create({});
  }

  async addEntry(entry: TAddEntry) : Promise<TEntry | null> {
    const newEntry = await this.model?.create(entry as any);
    return newEntry ? this.#mapper.create(newEntry) : null;
  }

  async removeEntry(entry: TRemoveEntry) : Promise<number> {

    const rows = await this.model?.findAll({ where : entry as any });
    if (!rows) {
      return 0;
    }
    let count = 0;
    for (const row of rows) {
      await row.destroy();
      count++;
    }
    return count;
  }

  async removeAllEntries(): Promise<number> {
    return this.model?.destroy({ where: {} }) ?? 0;
  }
};
