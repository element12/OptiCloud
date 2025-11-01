import pg from "pg";
import dotenv from "dotenv";
dotenv.config(); // Carga las variables de entorno desde .env

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Azure PG exige TLS; para demo deshabilitamos validación de CA
});