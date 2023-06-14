const mysql = require('mysql');

// Database configuration
const connection = mysql.createConnection({
  user:'root',
  password: '',
  host:'localhost',
  database:'nodetask',
  port:3306
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});


module.exports = { connection };
