const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const DriverRouter = express.Router();

//register driver
DriverRouter.post('/register/driver',  async (req, res) => {

    try {
        const { driver_code, driver_name } = req.body;

        const insertUserQuery = 'INSERT INTO drivers (driver_code, driver_name) VALUES (?,?)';
        await db.promise().execute(insertUserQuery, [driver_code, driver_name]);

        res.status(201).json({ message: 'Driver registered successfully' });
    }
    catch (error) {
        console.error('Error registering Driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//display all drivers
DriverRouter.get('/displaydriver', authenticateToken ,(req, res) => {
    try {
        db.query('select driver_id, driver_code, driver_name from driver;', (err, result) => {
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
        console.error('Error loading drivers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// display specific driver
DriverRouter.get('/displaydriver/:id', (req, res) => {
    let driver_id = req.params.id;

    if (!driver_id) {
        return res.status(400).send({ error: true, message: 'Please provide driver_id' });
    }

    try {
        db.query('SELECT driver_id, driver_code, driver_name FROM drivers WHERE driver_id = ?;', [driver_id], (err, result) => {
            if (err) {
                console.error('Error fetching driver:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// update info from driver
DriverRouter.put('/updatedriver/:id', async (req, res) => {
    let driver_id = req.params.id;

    const { driver_code, driver_name } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);

    if (!driver_id || !driver_code || !driver_name) {
        return res.status(400).send({ error: user, message: 'Please provide driver code and driver name' });
    }

    try {
        db.query('UPDATE drivers SET driver_code = ?, driver_name = ? WHERE driver_id = ?', [driver_code, driver_name, driver_id], (err, result, fields) => {

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

// delete info from driver start //
DriverRouter.delete('/deletedriver/:id', (req, res) => {
    let driver_id = req.params.id;

    if (!driver_id) {
        return res.status(400).send({ error: true, message: 'Please provide driver_id' });
    }

    try {
        db.query('DELETE FROM drivers WHERE driver_id = ?', driver_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = DriverRouter;