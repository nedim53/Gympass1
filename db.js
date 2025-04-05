const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'bazepodataka.ba',
    user: 'student391IT',
    password: '10948',
    database: 'student391IT',
    port: '7306'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Greška pri povezivanju sa bazom:', err);
    } else {
        console.log('Uspešno povezivanje sa bazom student391IT.');
        connection.release(); 
    }
});

const promisePool = pool.promise();
module.exports = promisePool;