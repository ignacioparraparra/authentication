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
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refresh_token TEXT
  )
  `
  await sql `CREATE TABLE IF NOT EXISTS posts (
  id SERIAL NOT NULL PRIMARY KEY,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id)
  )`
  console.log("Initializing Complete")
}

module.exports = {sql, initializeDb};