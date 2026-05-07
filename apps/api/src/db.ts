import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const DB_PATH = process.env.DATABASE_PATH || './data/promos.db';
const db: Database.Database = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Run once on startup to create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    websiteUrl TEXT,
    hours TEXT,
    instagram TEXT,
    facebook TEXT,
    tiktok TEXT,
    x TEXT
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT,
    startDate TEXT,
    endDate TEXT,
    canonicalUrl TEXT NOT NULL,
    portalSource TEXT NOT NULL,
    scrapedAt TEXT NOT NULL,
    brandId TEXT NOT NULL,
    FOREIGN KEY (brandId) REFERENCES brands(id)
  );
`);

export default db;