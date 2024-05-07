const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../database/database');
const authenticateToken = require('../middleware/authenticateToken');

const TripsRouter = express.Router(); //modular route handler

// registering trips start //
TripsRouter.post('/registertrips',  async (req, res) => {

    try {
        const { destination, end_time, start_time, jeep_id, origin} = req.body;

        const insertUserQuery = 'INSERT INTO trips (destination, end_time, start_time, jeep_id, origin) VALUES (?,?)';
        await db.promise().execute(insertUserQuery, [destination, end_time, start_time, jeep_id, origin]);

        res.status(201).json({ message: 'trips registered successfully' });
    }
    catch (error) {
        console.error('Error registering trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// display trips start //
TripsRouter.get('/trips', authenticateToken ,(req, res) => {
    try {
        db.query('select trip_id, destination, end_time, start_time, jeep_id, origin from trips;', (err, result) => {
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
        console.error('Error loading trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// display specific trips 
TripsRouter.get('/displaytrips/:id', (req, res) => {
    let trip_id = req.params.id;

    if (!trip_id) {
        return res.status(400).send({ error: true, message: 'Please provide trip_id' });
    }

    try {
        db.query('SELECT trip_id, destination, end_time, start_time, jeep_id, origin WHERE trip_id = ?;', [trip_id], (err, result) => {
            if (err) {
                console.error('Error fetching trips:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// update info from trips start //
TripsRouter.put('/updatetrips/:id', async (req, res) => {
    let trip_id = req.params.id;

    const { destination, end_time, start_time, jeep_id, origin } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);

    if (!trip_id || !destination || !end_time ||!start_time ||!jeep_id ||!origin) {
        return res.status(400).send({ error: user, message: 'Please provide destination, end_time, start_time , jeep_id and origin' });
    }

    try {
        db.query('UPDATE trips SET destination = ?, end_time = ?, jeep_id =?, origin = ? WHERE trip_id = ?', [destination, end_time, start_time, jeep_id, origin, trip_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete info from trips start //
TripsRouter.delete('/deletetrips/:id', (req, res) => {
    let trip_id = req.params.id;

    if (!trip_id) {
        return res.status(400).send({ error: true, message: 'Please provide trip_id' });
    }

    try {
        db.query('DELETE FROM trips WHERE trip_id = ?', trip_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    }

    catch (error) {
        console.error('Error loading trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = TripsRouter;
