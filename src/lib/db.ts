// src/lib/db.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "debugging_disciples";

if (!uri) {
  throw new Error("Please set the MONGODB_URI environment variable.");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
const clientPromise: Promise<MongoClient> = (global._mongoClientPromise || (() => {
  try {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    global._mongoClientPromise = client.connect();
    return global._mongoClientPromise;
  } catch (error) {
    console.error("Failed to create MongoDB client:", error);
    throw error;
  }
})()) as Promise<MongoClient>;

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}
