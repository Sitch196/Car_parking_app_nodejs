require('dotenv').config();
const pool = require('../database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

       // Check password length
       if (password.length < 7) {
        return res.status(400).json({
          status: 'Failed',
          message: 'Password must be at least 7 characters long',
        });
      }

    // Check if a user with the same email already exists in the database
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      // User with the same email already exists
      return res.status(400).json({
        status: 'Failed',
        message: 'User with that email already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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
    } else {
      res.status(500).json({
        status: 'Failed',
        message: 'User registration failed',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the provided email exists in the database
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      // No user found with the provided email
      return res.status(401).json({
        status: 'Failed',
        message: 'Email or password is not correct',
      });
    }

    // Verify the provided password against the stored hashed password
    const user = users[0]; // Assuming there's only one user with a given email
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Passwords do not match
      return res.status(401).json({
        status: 'Failed',
        message: 'Email or password is not correct',
      });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      status: 'Success',
      message: 'User successfully logged in',
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};


const protect = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if the token is missing or doesn't start with "Bearer "
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'Failed',
        message: 'You have to be Logged In to Perform this action !!',
      });
    }

    // Extract the token without "Bearer "
    const tokenValue = token.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Attach the user ID to the request for future use
    req.userId = decoded.userId;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'Failed',
      message: 'Unauthorized: Invalid token',
    });
  }
};

module.exports = protect;

module.exports = {
  signup,
  login,
  protect,
};
