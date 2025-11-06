import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("✅ Connected Database Postgresql");
// console.log("DB URL:", process.env.DATABASE_URL);
