const mysql = require('mysql');

const db  = mysql.createConnection({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'pfe',
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connexion à la base réussi.");
});

module.exports = db;