const express = require("express");
const authcontroller = require("../controllers/authControllers");
const router = express.Router();
const parkingController = require("../controllers/parkingContoller");

router.post("/", parkingController.addParkingZone);
router.get(
  "/",
  authcontroller.protect,
  authcontroller.permissionTo("admin"),
  parkingController.getAllParking
);

module.exports = router;
