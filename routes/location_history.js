const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const LocationHistoryRouter = express.Router(); //modular route handler

// display location_history start //
LocationHistoryRouter.get('/locationhistory', (req, res) => {
    try {
        db.query('select location_id, timestamp, latitude, longitude, recorded at, vehicle_id from location_history;', (err, result) => {
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
// display location_history end //

// display specific location_history start //
LocationHistoryRouter.get('/locationhistory/:id', (req, res) => {
    let vehicle_id = req.params.id;

    if (!vehicle_id) {
        return res.status(400).send({ error: true, message: 'Please provide vehicle_id' });
    }

    try {
        db.query('select location_id, timestamp, latitude, longitude, recorded at from vehicles where vehicle_id= ?;', vehicle_id, (err, result) => {
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
// display specific location_history end //

module.exports = LocationHistoryRouter;