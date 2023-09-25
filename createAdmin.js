require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./database");

const createAdminUser = async () => {
  try {
    // Hash the admin password
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [
        process.env.ADMIN_USERNAME,
        process.env.ADMIN_EMAIL,
        hashedPassword,
        "admin",
      ]
    );

    console.log("Admin user created successfully.");
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
};

createAdminUser();
