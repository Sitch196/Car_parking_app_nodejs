const pool = require("../database");

const addCar = async (req, res) => {
  try {
    const { type, model, year } = req.body;
    const userId = req.userId;
    // Insert the car into the database
    const [result] = await pool.query(
      "INSERT INTO cars (user_id, type, model, year) VALUES (?, ?, ?, ?)",
      [userId, type, model, year]
    );

    // Check if the car was successfully inserted
    if (result.affectedRows === 1) {
      res.status(201).json({
        status: "Success",
        message: "Car added successfully",
      });
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Car insertion failed",
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

// Get all cars from the cars table
async function getAllCars(req, res) {
  try {
    const userId = req.userId;
    // Query the database to get all cars for the specific user
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
// async function getCarsByCriteria(req, res) {
//     try {
//       const userId = req.userId;
//       const { year, model, type } = req.query;

//       // Build the SQL query dynamically based on the provided criteria
//       const queryParams = [];
//       let query = 'SELECT * FROM cars WHERE ';

//       // Check and add filters for year, model, and type if provided
//       if (year) {
//         query += ' AND year = ?';
//         queryParams.push(year);
//       }

//       if (model) {
//         query += ' AND model = ?';
//         queryParams.push(model);
//       }

//       if (type) {
//         query += ' AND type = ?';
//         queryParams.push(type);
//       }

//       // Add the user ID as the first parameter
//       queryParams.unshift(userId);

//       // Execute the query
//       const [rows] = await pool.query(query, queryParams);

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'No cars found matching the criteria' });
//       }

//       res.json(rows);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

module.exports = {
  addCar,
  getAllCars,
  getOneCar,
  updateCar,
  deleteCar,
};
