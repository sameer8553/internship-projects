const express = require('express');
const router = express.Router();

// Data - Users stored in memory
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 25 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 30 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 28 }
];

let nextId = 4;

// Helper functions
function findUserById(id) {
    return users.find(user => user.id === id);
}

function findUserIndex(id) {
    return users.findIndex(user => user.id === id);
}

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

// GET ALL USERS
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET USER BY ID
router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let user = findUserById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: `User with ID ${id} not found`
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// CREATE NEW USER
router.post('/', (req, res) => {
    let { name, email, age } = req.body;

    let errors = validateUser(name, email, age);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    let newUser = {
        id: nextId++,
        name: name.trim(),
        email: email.trim(),
        age: parseInt(age)
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// UPDATE USER
router.put('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let { name, email, age } = req.body;

    let userIndex = findUserIndex(id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `User with ID ${id} not found`
        });
    }

    let errors = validateUser(name, email, age);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    users[userIndex] = {
        id: id,
        name: name.trim(),
        email: email.trim(),
        age: parseInt(age)
    };

    res.json({
        success: true,
        message: 'User updated successfully',
        data: users[userIndex]
    });
});

// DELETE USER
router.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id);

    let userIndex = findUserIndex(id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `User with ID ${id} not found`
        });
    }

    let deletedUser = users.splice(userIndex, 1)[0];

    res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
    });
});

module.exports = router;