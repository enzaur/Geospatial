const express = require('express');
const bcrypt = require('bcrypt'); //hashing password
const jwt = require('jsonwebtoken'); //authetication and authorization
const db = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');
const secretKey = 'lorenzo-secret-key';

const ETARouter = express.Router(); //modular route handler

// display eta start //
ETARouter.get('/eta', authenticateToken, (req, res) => {
    try {
        db.query('select eta_id, destination, eta, timestamp, vehicle_id from eta;', (err, result) => {
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
// display eta end //

// display specific eta start //
ETARouter.get('/eta/:id', authenticateToken, (req, res) => {
    let eta_id = req.params.id;

    if (!eta_id) {
        return res.status(400).send({ error: true, message: 'Please provide eta_id' });
    }

    try {
        db.query('select destination, eta, timestamp, vehicle_id from eta where eta_id= ?;', eta_id, (err, result) => {
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
// display specific eta end //

module.exports = ETARouter;