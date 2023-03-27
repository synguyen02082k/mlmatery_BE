const express = require("express");
const {
  getUsers,
  createUser,
  deleteUser,
  deleteUsers,
  getUser,
  updateUser,
  loginUser,
  refreshToken,
  getMe,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/me").get(isAuthenticatedUser, getMe);
router.route("/login").post(loginUser);
router.route("/token").post(refreshToken);
router.route("/users").get(isAuthenticatedUser, getUsers);
router.route("/users").post(createUser);
router.route("/user/:id").delete(deleteUser);
router.route("/user/:id").get(getUser);
router.route("/users/:ids").delete(deleteUsers);
router.route("/user/:id").put(updateUser);

module.exports = router;
