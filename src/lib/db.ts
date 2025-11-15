// src/lib/db.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "debugging_disciples";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function createConnection(mongoUri: string): Promise<MongoClient> {
  try {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    console.log("✓ Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:", error);
    throw error;
  }
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createConnection(uri);
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  try {
    const client = await getClientPromise();
    const db = client.db(dbName);
    
    // Verify connection with a simple ping
    await db.admin().ping();
    
    return db;
  } catch (error) {
    console.error("✗ Database error:", error);
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
