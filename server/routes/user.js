const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signup,
  logout,
  getThisUser,
  getUser,
  update,
  erase,
  loggedin
} = require("../api/user/user.controller");

router.get("/loggedin", loggedin);
router.get("/logout", logout);
router.get("/:id", getUser);
router.get("/", getThisUser);
router.put("/update", update);
router.post("/login", passport.authenticate("user-local"), function(req, res) {
  res.status(200).json(req.user);
});
router.post("/signup", signup);
router.delete("/", erase);

module.exports = router;
