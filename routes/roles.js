
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const RoleRouter = express.Router(); //modular route handler

// registering role start //
RoleRouter.post('/registerrole',  async (req, res) => {

    try {
        const { role_code, role_name } = req.body;

        const insertUserQuery = 'INSERT INTO roles (role_code, role_name) VALUES (?,?)';
        await db.promise().execute(insertUserQuery, [role_code, role_name]);

        res.status(201).json({ message: 'Role registered successfully' });
    }
    catch (error) {
        console.error('Error registering role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// registering role end //


// display roles start //
RoleRouter.get('/roles', authenticateToken ,(req, res) => {
    try {
        db.query('select role_id, role_code, role_name from roles;', (err, result) => {
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
        console.error('Error loading roles:', error);
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
        db.query('SELECT role_id, role_code, role_name FROM roles WHERE role_id = ?;', [role_id], (err, result) => {
            if (err) {
                console.error('Error fetching role:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading role:', error);
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
        console.error('Error loading roles:', error);
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
