require("dotenv").config();

const {
  transporter,
  welcomeMail,
  paymentMail
} = require("../../config/nodemailer/transporter");

const _ = require("lodash");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const passport = require("passport");
const bcryptSalt = parseInt(process.env.BCRYPT);
const debug = require("debug")("server:user.controller");
const fields = Object.keys(_.omit(User.schema.paths, ["__v", "_id"]));

const loggedin = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(400).json({ message: "You should loggin first" });
  }
};

const logInPromise = (user, req) =>
  new Promise((resolve, reject) => {
    req.login(user, err => {
      if (err) return reject("Something went wrong");
      resolve(user);
    });
  });

const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Indicate email and password" });
    return;
  }

  User.findOne({ email })
    .then(user => {
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

      return newUser
        .save()
        .then(user => {
          welcomeMail.to = email;
          transporter
            .sendMail(welcomeMail)
            .then(info => debug("Nodemailer Info: " + info))
            .catch(err => debug("Nodemailer Error: " + err));

          logInPromise(user, req).then(user => res.status(200).json(user)).catch(err => res
            .status(400)
            .json({ message: "Something went wrong when loggin in user" })
          )
        })
        .catch(err =>
          res
            .status(400)
            .json({ message: "Something went wrong when saving user" })
        );
    })
    .catch(e => res.status(400).json({ message: "Something went wrong" }));
};

const logout = (req, res) => {
  const user = req.user;
  if (user) {
    req.session.destroy(function (err) {
      res.status(200).json({ message: "Logged out" });
    });
  } else {
    res.status(400).json({ message: "You are not logged in!" });
  }
};

const getThisUser = (req, res, next) => {
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

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Error retrieving user" });
    });
};

const update = (req, res, next) => {
  let updates = _.pick(req.body, fields);

  if (req.body.newPassword) {
    User.findById(req.user.id)
      .then(user => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const hashPass = bcrypt.hashSync(req.body.newPassword, salt);
          updates.password = hashPass;

          User.update(updates)
            .then(user => {
              res.status(200).json({
                message: "User updated. Password updated."
              });
            })
            .catch(err => {
              debug(err);
              res.status(400).json({
                message: "Error updating user"
              });
            });
        } else {
          res.status(400).json({ message: "Incorrect password" });
          return;
        }
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error updating user"
        });
      });
  } else {
    updates = _.omit(updates, ["password"]);

    User.findByIdAndUpdate(req.user.id, updates)
      .then(user => {
        res.status(200).json({
          message: "User updated. No password updated."
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error updating user"
        });
      });
  }
};

const erase = (req, res, next) => {
  if (req.user) {
    User.findByIdAndRemove(req.user.id)
      .then(() => {
        req.session.destroy(function (err) {
          res.status(200).json({ message: "User removed" });
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({ message: "Error erasing user" });
      });
  } else {
    res.status(400).json({ message: "You are not logged in!" });
    return;
  }
};

module.exports = {
  loggedin,
  signup,
  logout,
  getThisUser,
  getUser,
  update,
  erase
};
