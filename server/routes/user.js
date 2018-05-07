const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signup,
  logout,
  getThisUser,
  getUser,
  update,
  erase
} = require("../api/user/user.controller");

router.get("/logout", logout);
router.get("/:id", getUser);
router.get("/", getThisUser);
router.put("/update", update);
router.post(
  "/login",
  passport.authenticate("user-local", {
    successRedirect: "/",
    failureRedirect: "/err",
    failureFlash: true,
    passReqToCallback: true
  })
);
router.post("/signup", signup);
router.delete("/", erase);

module.exports = router;
