require("dotenv").config();
const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check password length
    if (password.length < 7) {
      return res.status(400).json({
        status: "Failed",
        message: "Password must be at least 7 characters long",
      });
    }

    // Check if a user with the same email already exists in the database
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: "Failed",
        message: "User with that email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database with the hashed password
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Check if the user was successfully inserted
    if (result.affectedRows === 1) {
      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(201).json({
        status: "Success",
        message: "User Successfully Registered",
        token,
      });
    } else {
      res.status(500).json({
        status: "Failed",
        message: "User registration failed",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the provided email exists in the database
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Email or password is not correct",
      });
    }

    // Verifying the provided password against the stored hashed password
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Passwords do not match
      return res.status(401).json({
        status: "Failed",
        message: "Email or password is not correct",
      });
    }

    // Determineing the user's role
    const isAdmin = user.role === "admin";

    // Generating a JWT token for the authenticated user with the role
    const token = jwt.sign(
      { userId: user.id, role: isAdmin ? "admin" : "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      status: "Success",
      message: "User successfully logged in",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "You have to be Logged In to Perform this action !!",
      });
    }

    const tokenValue = token.replace("Bearer ", "");

    // Verify the token using your JWT secret
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Attach the user ID and role to the request for future use
    req.userId = decoded.userId;

    // Attach the user role to req.userRole
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      message: "Unauthorized: Invalid token",
    });
  }
};

const permissionTo = (role) => {
  return (req, res, next) => {
    if (req.userRole === role) {
      next();
    } else {
      res.status(403).json({
        status: "Failed",
        message: "You have to be ADMIN to perform this action",
      });
    }
  };
};

module.exports = {
  signup,
  login,
  protect,
  permissionTo,
};
