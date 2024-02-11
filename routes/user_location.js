const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const UserLocationRouter = express.Router(); //modular route handler

// display user_location start //
UserLocationRouter.get('/user_location', (req, res) => {
    try {
        db.query('select user_id, location_id, latitude, longitude, timestamp from user_location;', (err, result) => {
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
UserLocationRouter.get('/user_location/:id', (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    try {
        db.query('select location_id, latitude, longitude, timestamp from user_location where user_id= ?;', status_id, (err, result) => {
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
// display specific user_location end //


module.exports = UserLocationRouter;