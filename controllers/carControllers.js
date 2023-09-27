const pool = require("../database");

const addCar = async (req, res) => {
  try {
    const { type, model, year, parking_zone_id } = req.body;
    const userId = req.userId;

    // Check if parking_zone_id is provided
    if (!parking_zone_id) {
      return res.status(400).json({ error: "Parking zone ID is required" });
    }

    // Check the user's balance
    const [userRows] = await pool.query(
      "SELECT balance FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userBalance = userRows[0].balance;

    // Calculate the parking fee based on the fee_per_hour
    const [zoneRows] = await pool.query(
      "SELECT fee_per_hour FROM ParkingZone WHERE id = ?",
      [parking_zone_id]
    );

    if (zoneRows.length === 0) {
      return res.status(404).json({ error: "Parking zone not found" });
    }

    const feePerHour = zoneRows[0].fee_per_hour;
    const parkingFee = feePerHour * 1;

    if (userBalance < parkingFee) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the parking fee from the user's balance
    const updatedBalance = userBalance - parkingFee;
    await pool.query("UPDATE users SET balance = ? WHERE id = ?", [
      updatedBalance,
      userId,
    ]);

    // Insert the car into the cars table
    const [carResult] = await pool.query(
      "INSERT INTO cars (user_id, type, model, year) VALUES (?, ?, ?, ?)",
      [userId, type, model, year]
    );

    // Check if the car was successfully inserted
    if (carResult.affectedRows !== 1) {
      return res.status(500).json({
        status: "Failed",
        message: "Car insertion failed",
      });
    }

    const carId = carResult.insertId;

    // Insert a record into parking_zone_cars to associate the car with the parking zone
    const [parkingZoneResult] = await pool.query(
      "INSERT INTO parking_zone_cars (parking_zone_id, car_id,user_id, parking_fee) VALUES (?, ?, ?,?)",
      [parking_zone_id, carId, userId, parkingFee]
    );

    // Check if the association was successful
    if (parkingZoneResult.affectedRows === 1) {
      res.status(201).json({
        status: "Success",
        message: "Car added and associated with parking zone successfully",
      });
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Failed to associate the car with the parking zone",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

// Get all cars from the cars table
async function getAllCars(req, res) {
  try {
    const userId = req.userId;
    const [rows] = await pool.query("SELECT * FROM cars WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No cars found for the user" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get one car by ID from the cars table
async function getOneCar(req, res) {
  const carId = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM cars WHERE id = ?", [carId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a car by ID in the cars table
async function updateCar(req, res) {
  try {
    const carId = req.params.id;
    const { type, model, year } = req.body;

    // Construct the SQL update statement dynamically based on the provided fields
    const updateFields = [];
    const params = [];

    if (type) {
      updateFields.push("type = ?");
      params.push(type);
    }

    if (model) {
      updateFields.push("model = ?");
      params.push(model);
    }

    if (year) {
      updateFields.push("year = ?");
      params.push(year);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updateQuery = `UPDATE cars SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    params.push(carId);

    // Update the car's information in the database
    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      status: "Success",
      message: "Car updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Failed",
      error: "Internal Server Error",
    });
  }
}

// Delete a car by ID from the cars table
async function deleteCar(req, res) {
  const carId = req.params.id;

  try {
    const [result] = await pool.query("DELETE FROM cars WHERE id = ?", [carId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addCar,
  getAllCars,
  getOneCar,
  updateCar,
  deleteCar,
};
