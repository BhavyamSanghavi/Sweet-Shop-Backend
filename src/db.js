require("dotenv").config();
const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false } // ✅ required for Supabase/Heroku/Neon
});

async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("✅ Database connected:", result[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = sql;
