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
  loggedin
} = require("../api/academy/academy.controller");

router.get('/loggedin',loggedin);
router.get("/logout",logout)
router.get("/:id", getOne);
router.get("/", getAll);
router.post(
  "/login",
  passport.authenticate("academy-local", {
    successRedirect: "/",
    failureRedirect: "/err",
    failureFlash: true,
    passReqToCallback: true
  })
);
router.post("/signup", signup);
router.put("/:id", update);
router.delete("/", erase);

module.exports = router;
