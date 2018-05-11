require("dotenv").config();

const _ = require("lodash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../user/user.model");
const Academy = require("./academy.model");
const debug = require("debug")("server:academy.controller");
const fields = Object.keys(_.omit(Academy.schema.paths, ["__v", "_id"]));
const bcryptSalt = parseInt(process.env.BCRYPT);
const salt = bcrypt.genSaltSync(bcryptSalt);

const {
  transporter,
  welcomeAcademy
} = require("../../config/nodemailer/transporter");

const logInPromise = (user, req) => {
  new Promise((resolve, reject) => {
    req.login(user, err => {
      if (err) return reject("Something went wrong at user login after signup");
      resolve(user);
    });
  });
};

const loggedIn = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(400).json({ message: "You should login first" });
  }
};

const logout = (req, res) => {
  const user = req.user;
  debug(user);
  if (user) {
    req.session.destroy(function(err) {
      res.status(200).json({ message: "Logged out" });
    });
  } else {
    res.status(400).json({ message: "You are not logged in!" });
  }
};

const signup = (req, res, next) => {
  const { email, name, phone, location, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Indicate email and password" });
    return;
  }

  Academy.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.status(409).json({ message: "User already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newAcademy = new Academy({
        email,
        name,
        password: hashPass
      });

      return newAcademy
        .save()
        .then(user => {
          welcomeAcademy.to = email;
          transporter
            .sendMail(welcomeAcademy)
            .then(info => debug("Nodemailer Info: " + info))
            .catch(err => debug("Nodemailer Error: " + err));

          logInPromise(user, req)
            .then(user => res.status(200).json(user))
            .catch(err =>
              res.status(400).json({
                message: "Something went wrong when loggin in academy"
              })
            );
        })
        .catch(err =>
          res
            .status(400)
            .json({ message: "Something went wrong when saving academy", err })
        );
    })
    .catch(e => res.status(400).json({ message: "Something went wrong!!!" }));
};

const getAll = (req, res, next) => {
  Academy.find()
    .select("-password")
    .then(academies => {
      res.status(200).json({ academies });
    })
    .catch(err => {
      debug(err);
      res.status(500).json({ message: "Error requesting academies" });
    });
};

const getOne = (req, res, next) => {
  Academy.findById(req.params.id)
    .select("-password")
    .then(academy => {
      res.status(200).json({ academy });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Academy not found" });
    });
};

const getThis = (req, res, next) => {
  if (req.user) {
    Academy.findById(req.user.id)
      .select("-password")
      .then(user => {
        res.status(200).json({ user });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({ message: "Error retrieving academy" });
      });
  } else {
    res.status(400).json({ message: "You should login as an Academy" });
  }
};

const update = (req, res, next) => {
  let updates = _.pick(req.body, fields);

  if (req.body.newPassword) {
    Academy.findById(req.user.id)
      .then(academy => {
        if (bcrypt.compareSync(req.body.password, academy.password)) {
          const hashPass = bcrypt.hashSync(req.body.newPassword, salt);
          updates.password = hashPass;

          Academy.update(updates)
            .then(academy => {
              res.status(200).json({
                message: "Academy updated. Password updated."
              });
            })
            .catch(err => {
              debug(err);
              res.status(400).json({ message: "Error updating academy" });
            });
        } else {
          res.status(400).json({ message: "Incorrect password" });
          return;
        }
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error updating academy"
        });
      });
  } else {
    updates = _.omit(updates, ["password"]);
    Academy.findByIdAndUpdate(req.user.id, updates)
      .then(academy => {
        res
          .status(200)
          .json({ message: "Academy updated. No password updated." });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({ message: "Error updating academy" });
      });
  }
};

const erase = (req, res, next) => {
  const user = req.session.user;
  if (user) {
    Academy.findByIdAndRemove(user._id)
      .then(() => {
        req.session.destroy(function(err) {
          res.status(200).json({ message: "Academy removed" });
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({ message: "Error erasing academy" });
      });
  } else {
    res.status(400).json({ message: "You are not logged in!" });
    return;
  }
};

module.exports = {
  loggedIn,
  logout,
  signup,
  getAll,
  getOne,
  getThis,
  update,
  erase
};
