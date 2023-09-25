require("dotenv").config();
const pool = require("../database");

const requestReset = async () => {
  const { email } = req.body;

  try {
    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Token expires in 1 hour

    // Store the reset token and expiration in the database
    const connection = await pool.getConnection();
    await connection.query(
      "UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?",
      [resetToken, expiration, email]
    );
    connection.release();

    const resetLink = `${process.env.HOST}${process.env.PORT}/reset-password?token=${resetToken}`;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_PROVIDER,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASSWORD,
      },
    });

    // Define the email message
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending email." });
      }
    });
    res.json({ message: "Password reset email sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
const resetPassword = async () => {
  const { token, newPassword } = req.body;

  try {
    // Find the user with the provided reset token and a valid expiration
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()",
      [token]
    );

    if (rows.length === 0) {
      connection.release();
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const user = rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await connection.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );
    connection.release();

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  resetPassword,
  requestReset,
};
