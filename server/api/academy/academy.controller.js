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

const getAll = (req, res, next) => {
  Academy.find()
    .then(academies => {
      res.status(200).json({ academies });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Error requesting academies" });
    });
};

const getOne = (req, res, next) => {
  Academy.findById(req.params.id)
    .then(academy => {
      res.status(200).json({ academy });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Academy not found" });
    });
};

const signup = (req, res, next) => {
  const { name, email } = req.body;
  const password = req.body.password;
  const exists = false;

  User.findOne({ email }, "email", (err, user) => {
    if(user !== null) exists === true;
  })

  Academy.findOne({ email }, "email", (err, academy) => {
    if (academy !== null && exists === true) {
      res.status(406).json({ message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newAcademy = new Academy({
      name,
      email,
      password: hashPass
    });

    newAcademy.save(err => {
      if (err) {
        debug(err);
        res.status(400).json({ message: "Something went wrong" });
      } else {
        res.status(201).json({ message: "Academy saved" });
      }
    });
  });
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

module.exports = { getAll, getOne, signup, update, erase };
