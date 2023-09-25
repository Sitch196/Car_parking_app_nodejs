const pool = require("../database");

const addParkingZone = async (req, res) => {
  try {
    const { zone_name, street_name, fee_per_hour } = req.body;

    // Insert the parking zone into the database
    const [result] = await pool.query(
      "INSERT INTO ParkingZone (zone_name, street_name, fee_per_hour) VALUES (?, ?, ?)",
      [zone_name, street_name, fee_per_hour]
    );

    // Check if the parking zone was successfully inserted
    if (result.affectedRows === 1) {
      res.status(201).json({
        status: "Success",
        message: "Parking zone added successfully",
      });
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Parking zone insertion failed",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};
async function getAllParking(req, res) {
  try {
    // Query the database to get all parking zones
    const [rows] = await pool.query("SELECT * FROM ParkingZone");

    if (rows.length === 0) {
      return res.status(404).json({ error: "No parking zones found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addParkingZone,
  getAllParking,
};
