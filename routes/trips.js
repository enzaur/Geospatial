const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const TripsRouter = express.Router(); //modular route handler

// display vehicles start //
TripsRouter.get('/vehiclestatuses', authenticateToken, (req, res) => {
    try {
        db.query('select trip_id, start_time, end_time, distance_travelled, user_id, vehicles_id from trips;', (err, result) => {
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
TripsRouter.get('/displayvehiclestatus/:id', authenticateToken, (req, res) => {
    let trip_id = req.params.id;

    if (!trip_id) {
        return res.status(400).send({ error: true, message: 'Please provide trip_id' });
    }

    try {
        db.query('select start_time, end_time, distance_travelled, user_id, vehicles_id from trips where trip_id= ?;', trip_id, (err, result) => {
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

module.exports = TripsRouter;