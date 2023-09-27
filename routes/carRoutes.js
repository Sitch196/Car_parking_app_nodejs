const express = require("express");
const router = express.Router();
const carControllers = require("../controllers/carControllers");
const authControllers = require("../controllers/authControllers");

router.post("/carList", authControllers.protect, carControllers.addCar);
router.get("/carList", authControllers.protect, carControllers.getAllCars);
router
  .route("/carList/:id")
  .get(authControllers.protect, carControllers.getOneCar)
  .delete(authControllers.protect, carControllers.deleteCar)
  .patch(authControllers.protect, carControllers.updateCar);

module.exports = router;
