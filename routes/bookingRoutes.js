const express = require("express");
const bookingControllers = require("../controllers/bookingControllers");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router
  .route("/")
  .get(authControllers.protect, bookingControllers.getAllBookingInfo);

module.exports = router;
