
const pool = require('../database')

async function getAllUsers(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      console.log(rows); // Add this line to log the retrieved data
      res.json(rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  module.exports = {
    getAllUsers,
  };