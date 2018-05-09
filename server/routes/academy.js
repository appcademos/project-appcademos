const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  loggedIn,
  logout,
  signup,
  getAll,
  getOne,
  getThis,
  update,
  erase
} = require("../api/academy/academy.controller");

router.get("/session", loggedIn);
router.get("/logout", logout);
router.get("/single/:id", getOne);
router.get("/all", getAll);
router.get("/", getThis);
router.put("/update/:id", update);
router.post("/login", passport.authenticate("academy-local"), function(
  req,
  res
) {
  res.status(200).json(req.user);
});
router.post("/signup", signup);
router.delete("/", erase);

module.exports = router;
