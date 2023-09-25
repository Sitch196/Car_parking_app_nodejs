const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");
const router = express.Router();
const passwordReset = require("../controllers/passwordreset");
router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/request-reset", passwordReset.requestReset);
router.post("/reset-password", passwordReset.resetPassword);

// only admin can view all of the registered users
router
  .route("/")
  .get(
    authControllers.protect,
    authControllers.permissionTo("admin"),
    userControllers.getAllUsers
  );
//log in with your createntials to delete update and get user
router
  .route("/:id")
  .get(authControllers.protect, userControllers.getOneUser)
  .delete(authControllers.protect, userControllers.deleteUser)
  .patch(authControllers.protect, userControllers.updateUser);

module.exports = router;
