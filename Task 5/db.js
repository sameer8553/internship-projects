const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('✅ MySQL connected successfully!');
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        return false;
    }
}

async function createTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                age INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(sql);
        console.log('✅ Users table created/verified!');
    } catch (error) {
        console.error('❌ Table creation failed:', error.message);
    }
}

module.exports = { db, testConnection, createTable };