const express = require('express');
const { extend, find } = require('lodash');
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

/**
 * 
 */
router.get('/call-list', (req, res, next) => {
  connection.query('select * from contacts as c', function (err, rows, fields) {
    if (err) throw err;

    let contacts = [];
    rows.forEach(item => {
      let c = JSON.parse(item.data);
      let idx = c.phone.findIndex(element => element.type === 'home');
      if(idx > -1) {
        let cl = {};
        // We only want the name and home phone number.
        extend(cl,{'name': c.name},{'phone' : c.phone[idx].number});
        contacts.push(cl);
      }
    });

    // Sort by last name and then first name.
    contacts.sort((a, b) => {
      let lastName1 = a.name.last.toLowerCase();
      let lastName2 = b.name.last.toLowerCase();
      if (lastName1 < lastName2) {
        return -1;
      }
      if (lastName1 > lastName2) {
        return 1;
      }
      
      if (lastName1 === lastName2) {
        let firstName1 = a.name.first.toLowerCase();
        let firstName2 = b.name.first.toLowerCase();
        if (firstName1 < firstName2) {
          return -1;
        }
        if (firstName1 > firstName2) {
          return 1;
        }
      }
      return 0;
    });
    res.send(contacts);
  });
});

/**
 * 
 */
router.get('/:id', (req, res, next) => {
  connection.query('select * from contacts as c where id = ' + req.params.id, function (err, row, fields) {
    if (err) throw err;
    let contact = {};
    contact.id = row[0].id;
    res.send(extend(contact,JSON.parse(row[0].data)));
  });
});

/**
 * 
 */
router.get('/', (req, res, next) => {
  connection.query('select * from contacts as c', function (err, rows, fields) {
    if (err) throw err;

    let contacts = [];
    rows.forEach(item => {
      let c = {};
      c.id = item.id;
      contacts.push(extend(c,JSON.parse(item.data)));
    });
    res.send(contacts);

  });
});

/**
 * 
 */
router.post('/', (req, res, next) => {
  let contact = req.body;
  let queryString = "insert into contacts (data) values ('" + JSON.stringify(contact) + "')"; 
  connection.query(queryString, function (err, result) {
    if (err) throw err;
    res.send("{'id':" + result.insertId + "}");
  })
  
});

/**
 * 
 */
router.put('/:id', function (req, res, next) {
  let contact = req.body;
  let queryString = "update contacts set data = '" + JSON.stringify(contact) + "' where id = " + req.params.id; 
  connection.query(queryString, function (err, result) {
    if (err) throw err;
    res.send("{'id':" + req.params.id + "}");
  })
});

/**
 * 
 */
router.delete('/:id', (req, res, next) => {
  connection.query('delete from contacts where id = ' + req.params.id, function (err, row, fields) {
    if (err) throw err;
    let contact = {};
    contact.id = row[0].id;
    res.send("{'id':" + req.params.id + "}");  // deleted ID.
  });
});


module.exports = router;