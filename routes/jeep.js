const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const JeepRouter = express.Router();

// CREATE a jeep
JeepRouter.post('/register/jeep', authenticateToken, async (req, res) => {
    try {
        const { plate_number, driver_id} = req.body;

        const query = 'INSERT INTO jeeps (plate_number, driver_id) VALUES ($1, $2) RETURNING *';
        const { rows } = await client.query(query, [plate_number, driver_id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error registering jeepney:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// READ all jeep
JeepRouter.get('/view_jeep', authenticateToken, async (res) => {
    try {
        const query = 'SELECT * FROM jeeps';
        const { rows } = await client.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error getting jeeps info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE a jeep
JeepRouter.put('/jeeps/:id', authenticateToken, async (req, res) => {
    try {
        const { jeep_id } = req.params;
        const { plate_number, driver_id } = req.body;

        const query = 'UPDATE jeeps SET plate_number = $1, driver_id = $2 WHERE jeep_id = $3 RETURNING *';

        const parameters = [plate_number, driver_id, jeep_id];

        const { rows } = await client.query(query, parameters);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE a jeep
JeepRouter.delete('/jeep/:id', authenticateToken, async (req, res) => {
    try {
        const { jeep_id } = req.params;
        const query = 'DELETE FROM jeeps WHERE jeep_id = $1';
        await client.query(query, [id]);
        res.json({ message: 'Jeep deleted successfully' });
    } catch (error) {
        console.error('Error deleting jeep:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = JeepRouter;