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

async function deleteParking(req, res) {
  const parkingId = req.params.id;

  try {
    // Check if the parking zone exists before attempting to delete it
    const [checkRows] = await pool.query(
      "SELECT * FROM ParkingZone WHERE id = ?",
      [parkingId]
    );

    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Parking zone not found" });
    }

    // If the parking zone exists, delete it
    await pool.query("DELETE FROM ParkingZone WHERE id = ?", [parkingId]);

    res.json({ message: "Parking zone deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
async function getParking(req, res) {
  const parkingId = req.params.id;

  try {
    // Retrieve the parking zone with the specified ID
    const [rows] = await pool.query("SELECT * FROM ParkingZone WHERE id = ?", [
      parkingId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Parking zone not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
async function updateParking(req, res) {
  try {
    const parkingId = req.params.id;
    const { zone_name, street_name, fee_per_hour } = req.body;

    // Construct the SQL update statement dynamically based on the provided fields
    const updateFields = [];
    const params = [];

    if (zone_name) {
      updateFields.push("zone_name = ?");
      params.push(zone_name);
    }

    if (street_name) {
      updateFields.push("street_name = ?");
      params.push(street_name);
    }

    if (fee_per_hour) {
      updateFields.push("fee_per_hour = ?");
      params.push(fee_per_hour);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updateQuery = `UPDATE ParkingZone SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    params.push(parkingId);

    // Update the parking zone's information in the database
    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Parking zone not found" });
    }

    res.json({
      status: "Success",
      message: "Parking zone updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Failed",
      error: "Internal Server Error",
    });
  }
}

module.exports = {
  addParkingZone,
  getAllParking,
  deleteParking,
  getParking,
  updateParking,
};
