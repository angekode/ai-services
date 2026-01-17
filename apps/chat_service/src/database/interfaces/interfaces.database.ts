export interface DatabaseInterface {
  connect() : Promise<void>;
  createTables() : Promise<void>;
  createModels() : Promise<void>;
};

export interface ModelInterface<TEntry, TQuery, TId, TAddEntry, TRemoveEntry> {
  init(): void;
  getAllEntries(): Promise<TEntry[]>;
  getEntries(query: TQuery): Promise<TEntry[]>;
  getFirstEntry(query: TQuery): Promise<TEntry | null>;
  getEntryWithId(id: TId): Promise<TEntry>;
  addEntry(entry: TAddEntry): Promise<TEntry | null>;
  removeEntry(entry: TRemoveEntry): Promise<number>;
};


