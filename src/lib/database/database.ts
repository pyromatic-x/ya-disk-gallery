import mongoose from "mongoose";

class DatabaseBase {
  private connectionString: string;
  private databaseName: string;

  private isConnected = false;
  constructor() {
    const cs = process.env.MONGO_CONNECTION_STRING as string;
    const name = process.env.MONGO_DATABASE_NAME as string;

    this.connectionString = cs;
    this.databaseName = name;
  }

  public async connect() {
    if (this.isConnected) return;

    try {
      await mongoose.connect(this.connectionString, {
        dbName: this.databaseName,
      });

      this.isConnected = true;
    } catch (error) {
      const e = error as Error;

      console.error(e);
      throw new Error(e?.message || "Something went during connection to database.");
    }
  }
}

export const database = new DatabaseBase();
