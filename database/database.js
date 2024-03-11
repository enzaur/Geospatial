const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6690273',
    password: 'kj3dqHGH8c',
    database: 'sql6690273' //'isfe2' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    }
    else{
        console.log('Connected to MySQL');
    }
})

module.exports = db;
