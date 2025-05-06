const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Bazdmeg1990',
    database: 'node-server',
});

module.exports= pool.promise();
