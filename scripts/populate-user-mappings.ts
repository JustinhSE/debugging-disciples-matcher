import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "debugging_disciples";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

interface UserMapping {
  firstName: string;
  lastName: string;
  userid: string;
  createdAt: Date;
}

async function populateUserMappings() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("✓ Connected to MongoDB");
    
    const db = client.db(dbName);
    const collection = db.collection("user_mappings");
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), "filtered_data.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    
    // Parse CSV
    const lines = csvContent.split("\n");
    
    // Skip header (line 0)
    const mappings: UserMapping[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const parts = line.split(",");
      
      // Extract fields (based on CSV header order)
      const fullname = parts[7]?.trim() || "";
      const userid = parts[6]?.trim() || "";
      
      if (!fullname || !userid) {
        console.warn(`⚠ Skipping line ${i + 1}: missing fullname or userid`);
        continue;
      }
      
      // Split fullname into first and last
      const nameParts = fullname.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");
      
      mappings.push({
        firstName,
        lastName,
        userid,
        createdAt: new Date(),
      });
    }
    
    console.log(`\n📝 Processing ${mappings.length} user mappings...`);
    
    if (mappings.length === 0) {
      console.log("⚠ No mappings to insert");
      return;
    }
    
    // Clear existing collection (optional - comment out if you want to keep existing data)
    // await collection.deleteMany({});
    // console.log("✓ Cleared existing user_mappings");
    
    // Insert mappings
    const result = await collection.insertMany(mappings);
    console.log(`✓ Inserted ${result.insertedIds.length} user mappings`);
    
    // Verify insertion
    const count = await collection.countDocuments();
    console.log(`✓ Total documents in user_mappings: ${count}`);
    
  } catch (error) {
    console.error("✗ Error:", error);
    throw error;
  } finally {
    await client.close();
    console.log("✓ Connection closed");
  }
}

// Run the script
populateUserMappings().catch(console.error);
