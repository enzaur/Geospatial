const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const LocationRouter = express.Router();

// Update Jeepney location
LocationRouter.put('/jeepneylocation/:id', authenticateToken, async (req, res) => {
    try {
        const { location_id } = req.params;
        const { latitude, longitude } = req.body;

        // Update the location of the Jeepney with the given ID
        const query = 'UPDATE jeepneys SET latitude = $1, longitude = $2 WHERE location_id = $3 RETURNING *';
        const { rows } = await client.query(query, [latitude, longitude, id]);

        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating Jeepney location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all Jeepney locations
LocationRouter.get('/jeepneys', authenticateToken, async (req, res) => {
    try {
        // Retrieve all Jeepney locations
        const query = 'SELECT * FROM jeepneys';
        const { rows } = await client.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching Jeepney locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = LocationRouter;
