const pool = require('../database')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    // Insert the user into the database with the hashed password
    const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    // Check if the user was successfully inserted
    if (result.affectedRows === 1) {
      // Generate a JWT token
      const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        status: 'Success',
        message: 'User Successfully Registered',
        token,
      });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: 'Failed',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  signup,
};
