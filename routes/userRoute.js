const express = require("express");
const { getUsers, createUser } = require("../controllers/userController");

const router = express.Router();

router.route("/users").get(getUsers);
router.route("/users").post(createUser);

module.exports = router;
