import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DATABASE_URL_NOSQL;

let db;
let products;

export async function connectDB() {
  try {
    if (!db) {
      console.log("🔍 Conectando a MongoDB...");
      const client = new MongoClient(uri);
      await client.connect();
      db = client.db("opticloud");
      products = db.collection("products");
      console.log("✅ Conectado correctamente a MongoDB");
    }
    return { db, products };
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1); // evita que app siga si la DB no conecta
  }
}

export { db, products };
