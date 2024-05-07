require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const e = require('cors');
const db = require('./database/database');
const app = express();
const PORT = process.env.PORT || 3306;
require('dotenv').config();

const RoleRouter = require('./routes/roles');
const UserRouter = require('./routes/users');
const DriverRouter = require('./routes/driver');
const JeepRouter = require('./routes/jeep');
const LocationRouter = require('./routes/location');
const TripsRouter = require('./routes/trips');

app.use(cors());
app.use(bodyParser.json());

//routes    
app.use('/', RoleRouter);
app.use('/', UserRouter);
app.use('/', DriverRouter);
app.use('/', JeepRouter);
app.use('/', LocationRouter);
app.use('/', TripsRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using ExpresJS'});
});
    
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
