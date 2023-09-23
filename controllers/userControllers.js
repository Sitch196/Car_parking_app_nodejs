
const pool = require('../database')

async function getAllUsers(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async function getOneUser(req, res) {
    try {
      const userId = req.params.id; 
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async function updateUser(req, res) {
    try {
      const userId = req.params.id; 
      const { name, email } = req.body;
  
      // Construct the SQL update statement dynamically based on the provided fields
      const updateFields = [];
      const params = [];
  
      if (name) {
        updateFields.push('name = ?');
        params.push(name);
      }
  
      if (email) {
        updateFields.push('email = ?');
        params.push(email);
      }
  
      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
  
      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      params.push(userId);
  
      // Update the user's information in the database
      await pool.query(updateQuery, params);
  
      res.json({
        status:'Success',
         message: 'User updated successfully' 
        });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        status:"failed",
        error: 'Internal Server Error' });
    }
  }
  
  async function deleteUser(req, res) {
    try {
      const userId = req.params.id; 
      // Delete the user from the database
      await pool.query('DELETE FROM users WHERE id = ?', [userId]);
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        status:'failed',
        error: 'Internal Server Error' });
    }
  }
  
  module.exports = {
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
  };