require("dotenv").config();
const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to MySQL database!");

    const [rows] = await connection.execute("SELECT NOW() AS now");
    console.log("🕒 Current time on DB server:", rows[0].now);

    await connection.end();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
}

testConnection();