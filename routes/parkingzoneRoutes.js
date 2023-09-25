const express = require("express");
const authcontroller = require("../controllers/authControllers");
const router = express.Router();
const parkingController = require("../controllers/parkingContoller");

//only admin can add parking zones
router.post(
  "/",
  authcontroller.protect,
  authcontroller.permissionTo("admin"),
  parkingController.addParkingZone
);

// only admin can see parking zones
router.get(
  "/",
  authcontroller.protect,
  authcontroller.permissionTo("admin"),
  parkingController.getAllParking
);

module.exports = router;
