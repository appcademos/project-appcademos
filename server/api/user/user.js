const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./user.model");

const {
  loggedIn,
  logout,
  signup,
  login,
  getThisUser,
  update
} = require("./user.controller");

router.get("/session", loggedIn);
router.get("/logout", logout);
router.get("/", getThisUser);
router.put("/update/:id", update);
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
