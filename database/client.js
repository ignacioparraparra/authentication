const postgres = require('postgres')
require('dotenv').config();

const sql = postgres({
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function initializeDb() {
  console.log("Initializing DB");
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`
}

module.exports = sql;
module.exports = {initializeDb};