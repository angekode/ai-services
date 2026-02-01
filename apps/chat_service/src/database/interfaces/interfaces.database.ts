export interface DatabaseInterface {
  connect() : Promise<void>;
  createTables() : Promise<void>;
  createModels() : Promise<void>;
};

export type GetOptions = {
  ordering?: {
    order: 'ascending' | 'descending';
    columnName: string
  }
};

export interface ModelInterface<TEntry, TQuery, TId, TAddEntry, TRemoveEntry, TUpdateEntry> {
  init(): void;
  getAllEntries(options?: GetOptions): Promise<TEntry[]>;
  getEntries(query: TQuery, options?: GetOptions): Promise<TEntry[]>;
  getFirstEntry(query: TQuery): Promise<TEntry | null>;
  getEntryWithId(id: TId): Promise<TEntry>;
  addEntry(entry: TAddEntry): Promise<TEntry | null>;
  removeEntry(entry: TRemoveEntry): Promise<number>;
  updateEntryWithId(id: TId, entry: TUpdateEntry): Promise<TEntry | null>;
  removeAllEntries(): Promise<number>;
};


