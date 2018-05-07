const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getAll,
  getOne,
  signup,
  update,
  erase
} = require("../api/academy/academy.controller");

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
