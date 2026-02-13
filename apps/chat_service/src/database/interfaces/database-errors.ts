export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ConnectionDatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}