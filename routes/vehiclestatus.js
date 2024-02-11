const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const VehicleStatusRouter = express.Router(); //modular route handler

// registering vehicle status start //
VehicleStatusRouter.post('/registervehiclestatus', async (req, res) => {

    try {
        const { status, vehicle_id} = req.body;
        const timestamp = new Date(); // Generate current timestamp

        const insertUserQuery = 'INSERT INTO vehicle_status (status, vehicle_id, timestamp) VALUES (?,?,?)';
        await db.promise().execute(insertUserQuery, [status, vehicle_id, timestamp]);

        res.status(201).json({ message: 'Vehicle registered successfully' });
    }
    catch (error) {
        console.error('Error registering vehicle status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// registering vehicle status end //

// display vehicles start //
VehicleStatusRouter.get('/vehiclestatuses', authenticateToken, (req, res) => {
    try {
        db.query('select vehicle_id, status, created_at from vehicle_status;', (err, result) => {
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
        console.error('Error loading vehicle status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// display vehicles end //

// display specific vehicle status start //
VehicleStatusRouter.get('/displayvehiclestatus/:id', authenticateToken, (req, res) => {
    let status_id = req.params.id;

    if (!status_id) {
        return res.status(400).send({ error: true, message: 'Please provide status_id' });
    }

    try {
        db.query('select vehicle_id, status, timestamp from vehicles where status_id= ?;', status_id, (err, result) => {
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
        console.error('Error loading vehicle:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// display specific vehicle status end //

// update info from vehicle start //
VehicleStatusRouter.put('/updatevehiclestatus/:id', authenticateToken, async (req, res) => {
    let status_id= req.params.id;

    const { status, vehicle_id } = req.body;
    const timestamp = new Date(); // Generate current timestamp

    if (!vehicle_id || !status) {
        return res.status(400).send({ error: user, message: 'Please registration plate and user id' });
    }

    try {
        db.query('UPDATE vehicle_status SET status= ?, vehicle_id = ?, created_at = ? WHERE status_id = ?', [status,vehicle_id, timestamp, status_id], (err, result, fields) => {

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
// update info from vehicle status end //



module.exports = VehicleStatusRouter;