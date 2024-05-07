const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const UserRouter = express.Router();
// CREATE a user
UserRouter.post('/register/user', async (req, res) => {
    try {
        const { first_name, last_name, username, password, email } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const query = 'INSERT INTO users (first_name, last_name, username, password, email) VALUES ($1, $2, $3, $4, #5) RETURNING *';
        const { rows } = await client.query(query, [first_name, last_name, username, hashedPassword, email]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
UserRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = 'SELECT * FROM users WHERE username = $1';
        const { rows } = await client.query(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Password is correct, you can now proceed with authentication

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// READ all users
UserRouter.get('/view_users', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const { rows } = await client.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE a user
UserRouter.put('users/:id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const { username, email, first_name, last_name, role_id, password } = req.body;

        const query = 'UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, role_id = $5, password = $6 WHERE user_id = $7 RETURNING *';

        const parameters = [username, email, first_name, last_name, role_id, password, user_id];

        const { rows } = await client.query(query, parameters);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE a user
UserRouter.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE user_id = $1';
        await client.query(query, [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = UserRouter;
