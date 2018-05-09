const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  loggedIn,
  logout,
  signup,
  getThisUser,
  getUser,
  update,
  erase
} = require("../api/user/user.controller");

router.get("/session", loggedIn);
router.get("/logout", logout);
router.get("/single/:id", getUser);
router.get("/", getThisUser);
router.put("/update/:id", update);
router.post("/login", passport.authenticate("user-local"), function(req, res) {
  res.status(200).json(req.user);
});
router.post("/signup", signup);
router.delete("/", erase);

module.exports = router;
