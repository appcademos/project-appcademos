require("dotenv").config();

const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const passport = require("passport");
const bcryptSalt = parseInt(process.env.BCRYPT);
const debug = require("debug")("server:user.controller");

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, errDetails) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong while autenticating",
        err
      });
      return;
    }

    if (!user) {
      res.status(401).json({
        message: "Cant found user in the dbs",
        errDetails
      });
      return;
    }

    req.login(user, err => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong"
        });
        return;
      }
      res.status(200).json({
        message: "Succesfully logged in",
        user: req.user
      });
    });
  })(req, res, next);
};

const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Indicate email and password" });
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
};

const logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logged out" });
};

const getUser = (req, res, next) => {
  if (req.user) {
    User.findById(req.user.id)
      .then(user => {
        res.status(200).json({ user });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({ message: "Error retrieving user" });
      });
  } else {
    res.status(400).json({ message: "User not logged" });
  }
};

module.exports = { login, signup, logout, getUser };
