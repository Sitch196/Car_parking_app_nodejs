const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Jme24in!",
  database: "parking_app",
}).promise()

module.exports = pool
