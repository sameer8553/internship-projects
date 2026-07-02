const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

async function connectDB() {
    try {
        db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });
        console.log('✅ SQLite connected successfully!');
        return db;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return null;
    }
}

async function createTable() {
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                age INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created/verified!');
    } catch (error) {
        console.error('❌ Table creation failed:', error.message);
    }
}

module.exports = { connectDB, createTable, getDB: () => db };