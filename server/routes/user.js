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
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
