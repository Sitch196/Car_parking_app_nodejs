const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.route("/").get(userControllers.getAllUsers);

router
  .route("/:id")
  .get(authControllers.protect, userControllers.getOneUser)
  .delete(authControllers.protect, userControllers.deleteUser)
  .patch(authControllers.protect, userControllers.updateUser);

module.exports = router;
