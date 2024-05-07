const { Client } = require('pg');

// Connection details
const connectionString = "postgresql://neondb_owner:RbX4zPUZjSJ8@ep-damp-base-a1xszt2m-pooler.ap-southeast-1.aws.neon.tech/geo-spatial-mobile-web?sslmode=require";

// Create a new PostgreSQL client
const client = new Client({
    connectionString: connectionString,
});

// Connect to the database
client.connect()
    .then(() => {
        console.log('Connected to the database');
        // You can start executing queries here
    })
    .catch(err => console.error('Error connecting to database', err));

module.exports = client;
