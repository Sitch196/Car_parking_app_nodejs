const pool = require("../database");

// Get all parking zone car records
async function getAllBookingInfo(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM parking_zone_cars");

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No parking zone car records found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllBookingInfo,
};
