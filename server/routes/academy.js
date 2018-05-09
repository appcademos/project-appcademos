const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getAll,
  getOne,
  signup,
  update,
  erase,
  logout,
  loggedin,
  getThisAcademy
} = require("../api/academy/academy.controller");

router.get("/loggedin", loggedin);
router.get("/logout", logout);
router.get("/single/:id", getOne);
router.get("/all", getAll);
router.get("/", getThisAcademy);
router.post("/login", passport.authenticate("academy-local"), function(
  req,
  res
) {
  res.status(200).json(req.user);
});
router.post("/signup", signup);
router.put("/:id", update);
router.delete("/", erase);

module.exports = router;
