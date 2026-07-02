const express = require('express');
const cors = require('cors');
const userRoutes = require('./users');
const { connectDB, createTable } = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'User Management API is running! 🚀',
        endpoints: {
            'GET /api/users': 'Get all users',
            'GET /api/users/:id': 'Get user by ID',
            'POST /api/users': 'Create new user',
            'PUT /api/users/:id': 'Update user by ID',
            'DELETE /api/users/:id': 'Delete user by ID'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: 'Please check the URL and try again'
    });
});

async function startServer() {
    const db = await connectDB();
    if (!db) {
        console.log('❌ Server stopped - database not connected');
        process.exit(1);
    }
    await createTable();
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
        console.log(`📋 API endpoints available at http://localhost:${PORT}/`);
    });
}

startServer();