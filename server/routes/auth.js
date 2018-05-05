require("dotenv").config();

const path = require("path");
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const passport = require("passport");
const bcryptSalt = process.env.BCRYPT;

const debug = require("debug")(`server:${path.basename(__dirname)}:auth`);
const User = require("../api/user/user.model");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass
    });

    newUser.save(err => {
      if (err) {
        res.status(400).json({ message: "Something went wrong" });
      } else {
        res.status(200).json({ message: "User saved" });
      }
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
