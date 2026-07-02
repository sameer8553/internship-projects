const express = require('express');
const router = express.Router();
const { getDB } = require('./db');

// GET ALL USERS
router.get('/', async (req, res) => {
    try {
        const rows = await getDB().all('SELECT * FROM users ORDER BY id');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET USER BY ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const row = await getDB().get('SELECT * FROM users WHERE id = ?', [id]);

        if (!row) {
            return res.status(404).json({
                success: false,
                error: `User with ID ${id} not found`
            });
        }

        res.json({
            success: true,
            data: row
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// CREATE NEW USER
router.post('/', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        const errors = validateUser(name, email, age);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: errors
            });
        }

        const result = await getDB().run(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [name.trim(), email.trim(), parseInt(age)]
        );

        const row = await getDB().get('SELECT * FROM users WHERE id = ?', [result.lastID]);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: row
        });

    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// UPDATE USER
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email, age } = req.body;

        const existing = await getDB().get('SELECT * FROM users WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `User with ID ${id} not found`
            });
        }

        const errors = validateUser(name, email, age);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: errors
            });
        }

        await getDB().run(
            'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
            [name.trim(), email.trim(), parseInt(age), id]
        );

        const row = await getDB().get('SELECT * FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User updated successfully',
            data: row
        });

    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE USER
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await getDB().get('SELECT * FROM users WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `User with ID ${id} not found`
            });
        }

        await getDB().run('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: existing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

function validateUser(name, email, age) {
    let errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!email.includes('@') || !email.includes('.')) {
        errors.push('Email must be valid (include @ and .)');
    }

    if (age === undefined || age === null) {
        errors.push('Age is required');
    } else if (isNaN(age) || age < 0 || age > 150) {
        errors.push('Age must be a number between 0 and 150');
    }

    return errors;
}

module.exports = router;