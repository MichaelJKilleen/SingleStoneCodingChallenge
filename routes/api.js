const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'P@ssw0rd!',
    database: 'singlestone',
    schema: 'singlestone',
    insecureAuth: true
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution)
});

//connection.end();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('server...');
    res.json({
        messages: [
            { message: 'hooray! welcome to our api!' },
            { message: 'Test 123' },
            { message: 'Test 456' }]
    });
});

//https://www.mysqltutorial.org/mysql-sample-database.aspx
//https://expressjs.com/en/guide/database-integration.html#sql-server
router.get('/hitdb', function (req, res, next) {
    connection.query('select * from contacts as c', function (err, rows, fields) {
        if (err) throw err;
        console.log('rows:' + rows.length);
        fields.forEach(f => console.log(f.name));
        console.log('fields' + fields.length);
        console.log('The solution is: ', JSON.parse(rows[0].data));
        let messages = [];
        rows.forEach(item => {
            messages.push({ message: item});
        });
        res.json({
            messages
        });
    });
});

module.exports = router;