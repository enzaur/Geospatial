const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const VehicleRouter = express.Router(); //modular route handler

// registering vehicle start //
VehicleRouter.post('/registervehicle', async (req, res) => {

    try {
        const { registration_plate, user_id} = req.body;
        const timestamp = new Date(); // Generate current timestamp

        const insertUserQuery = 'INSERT INTO vehicles (registration_plate, user_id, created_at) VALUES (?,?,?)';
        await db.promise().execute(insertUserQuery, [registration_plate, user_id, timestamp]);

        res.status(201).json({ message: 'Vehicle registered successfully' });
    }
    catch (error) {
        console.error('Error registering vehicle:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// registering vehicle end //

// display vehicles start //
VehicleRouter.get('/vehicles', authenticateToken, (req, res) => {
    try {
        db.query('select vehicle_id, registration_plate, created_at, user_id from vehicles;', (err, result) => {
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
        console.error('Error loading vehicles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// display vehicles end //

// display specific vehicle start //
VehicleRouter.get('/displayvehicle/:id', (req, res) => {
    let vehicle_id = req.params.id;

    if (!vehicle_id) {
        return res.status(400).send({ error: true, message: 'Please provide vehicle_id' });
    }

    try {
        db.query('select vehicle_id, registration_plate, created_at, user_id from vehicles where vehicle_id= ?;', vehicle_id, (err, result) => {
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
// display specific vehicle end //

// update info from vehicle start //
VehicleRouter.put('/updatevehicle/:id', async (req, res) => {
    let vehicle_id= req.params.id;

    const { registration_plate, user_id} = req.body;
    const timestamp = new Date(); // Generate current timestamp

    if (!vehicle_id || !registration_plate || !user_id) {
        return res.status(400).send({ error: user, message: 'Please registration plate and user id' });
    }

    try {
        db.query('UPDATE vehicles SET registration_plate = ?, user_id = ?, created_at = ? WHERE vehicle_id = ?', [registration_plate,user_id, timestamp, vehicle_id], (err, result, fields) => {

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
// update info from vehicle end //

// delete info from vehicle start //
VehicleRouter.delete('/deletevehicle/:id', (req, res) => {
    let vehicle_id = req.params.id;

    if (!vehicle_id) {
        return res.status(400).send({ error: true, message: 'Please provide vehicle_id' });
    }

    try {
        db.query('DELETE FROM vehicles WHERE vehicle_id = ?', vehicle_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Vehicle deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Vehicle not found' });
                }
            }
        });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete info from vehicle end //

module.exports = VehicleRouter;