const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const RoleRouter = express.Router(); //modular route handler

// registering role start //
RoleRouter.post('/registerrole',  async (req, res) => {

    try {
        const { role_code, role_name } = req.body;

        const insertUserQuery = 'INSERT INTO role (role_code, role_name) VALUES (?,?)';
        await db.promise().execute(insertUserQuery, [role_code, role_name]);

        res.status(201).json({ message: 'Role registered successfully' });
    }
    catch (error) {
        console.error('Error registering role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// registering role end //

// login start //
RoleRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.promise().execute(getUserQuery, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
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

// display roles start //
RoleRouter.get('/roles', (req, res) => {
    try {
        db.query('select role_id, role_code, role_name from role;', (err, result) => {
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
// display roles end //

// display specific role start //
RoleRouter.get('/displayrole/:id', (req, res) => {
    let role_id = req.params.id;

    if (!role_id) {
        return res.status(400).send({ error: true, message: 'Please provide role_id' });
    }

    try {
        db.query('select role_id, role_code, role_name from role where role_id= ?;', role_id, (err, result) => {
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
// display specific role end //

// update info from role start //
RoleRouter.put('/updaterole/:id', async (req, res) => {
    let role_id = req.params.id;

    const { role_code, role_name } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);

    if (!role_id || !role_code || !role_name) {
        return res.status(400).send({ error: user, message: 'Please provide role code and role name' });
    }

    try {
        db.query('UPDATE role SET role_code = ?, role_name = ? WHERE role_id = ?', [role_code, role_name, role_id], (err, result, fields) => {

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
// update info from role end //

// delete info from role start //
RoleRouter.delete('/deleterole/:id', (req, res) => {
    let role_id = req.params.id;

    if (!role_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    try {
        db.query('DELETE FROM role WHERE role_id = ?', role_id, (err, result, fields) => {
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
// delete info from role end //

module.exports =  RoleRouter;