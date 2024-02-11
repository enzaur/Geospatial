const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const e = require('cors');
const db = require('./database/database');
const app = express();
const PORT = process.env.PORT || 3001;

const RoleRouter = require('./routes/roles');
const UserRouter = require('./routes/user');
const VehicleRouter = require('./routes/vehicle');
const VehicleStatusRouter = require('./routes/vehiclestatus');
const UserLocationRouter = require('./routes/user_location');
const LocationHistoryRouter = require('./routes/Location_history');
const TripsRouter = require('./routes/trips');

app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/', RoleRouter);
app.use('/', UserRouter);
app.use('/', VehicleRouter);
app.use('/', VehicleStatusRouter);
app.use('/', UserLocationRouter);
app.use('/', LocationHistoryRouter);
app.use('/', TripsRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using ExpresJS'});
});
    
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});