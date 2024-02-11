const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const UserRouter = express.Router(); //modular route handler

// login start //
UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.promise().execute(getUserQuery, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error lodging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// login ends //

// registering user start //
UserRouter.post('/register', async (req, res) => {

    try {
        const { name, username, email, password, role_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'INSERT INTO users (name, username, email, password, role_id) VALUES (?,?,?,?,?)';
        await db.promise().execute(insertUserQuery, [name, username, email, hashedPassword, role_id]);

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// registering user end //

// display users start //
UserRouter.get('/users',authenticateToken, (req, res) => {
    try {
        db.query('select user_id, name, username, email, role_id from users;', (err, result) => {
            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
            else {
                res.status(200).json(result);
            }
        });
    }
    catch (error) {
        console.error('Error loading users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// display users end //

// display specific user start //
UserRouter.get('/displayuser/:id',authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    try {
        db.query('select user_id, name, username, email, role_id from users where user_id= ?;', user_id, (err, result) => {
            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
            else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// display specific user end //

// update info from user start //
UserRouter.put('/updateuser/:id',authenticateToken, async (req, res) => {
    let user_id = req.params.id;

    const { name, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user_id || !name || !username || !email ||!password) {
        return res.status(400).send({ error: user, message: 'Please provide name, username, and password' });
    }

    try {
        db.query('UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE user_id = ?', [name, username, email, hashedPassword, user_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// update info from user end //

// delete info from user start //
UserRouter.delete('/delete/:id', authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    try {
        db.query('DELETE FROM users WHERE user_id = ?', user_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// delete info from user end //


module.exports = UserRouter;