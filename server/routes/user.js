const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  login,
  signup,
  logout,
  getUser
} = require("../api/user/user.controller");

router.get("/", getUser);
router.get("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
