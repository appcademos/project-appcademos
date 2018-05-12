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

const logInPromise = (academy, req) => {
  return new Promise((resolve, reject) => {
    req.login(academy, err => {
      if (err) return reject("Something went wrong at academy login after signup");
      return resolve(academy);
    });
  });
};

const loggedIn = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(400).json({
      message: "You should login first"
    });
  }
};

const logout = (req, res) => {
  const user = req.user;
  if (user) {
    req.session.destroy(function (err) {
      res.status(200).json({
        message: "Logged out"
      });
    });
  } else {
    res.status(400).json({
      message: "You are not logged in!"
    });
  }
};

const signup = (req, res, next) => {
  const {
    name,
    email,
    location,
    password
  } = req.body;

  if (email === "" || password === "") {
    res.status(401).json({
      message: "Indicate email and password"
    });
    return;
  }

  Academy.findOne({
      email
    })
    .then(academy => {
      if (academy !== null) {
        res.status(409).json({
          message: "Academy already exists"
        });
        return;
      } else {
        User.findOne({
            email
          })
          .then(user => {
            if (user !== null) {
              res.status(409).json({
                message: "This email is registered as a student"
              });
              return;
            } else {
              const salt = bcrypt.genSaltSync(bcryptSalt);
              const hashPass = bcrypt.hashSync(password, salt);

              const newAcademy = new Academy({
                name,
                email,
                location,
                password: hashPass
              });

              newAcademy
                .save()
                .then(academy => {
                  logInPromise(academy, req)
                    .then(academy => res.status(200).json(academy));
                })
            }
          })
      }
    })
    .catch(e =>
      res
      .status(400)
      .json({
        message: "Something went wrong when trying to save Academy"
      })
    );
};

const login = (req, res, next) => {
  passport.authenticate("academy-local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    logInPromise(user, req)
      .then(user => res.status(200).json(user));

  })(req, res, next);
}


const getAll = (req, res, next) => {
  Academy.find()
    .select("-password")
    .then(academies => {
      res.status(200).json({
        academies
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error requesting academies"
      });
    });
};

const getOne = (req, res, next) => {
  Academy.findById(req.params.id)
    .select("-password")
    .then(academy => {
      res.status(200).json({
        academy
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Academy not found"
      });
    });
};

const getThis = (req, res, next) => {
  if (req.user) {
    Academy.findById(req.user.id)
      .select("-password")
      .then(user => {
        res.status(200).json({
          user
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Error retrieving academy"
        });
      });
  } else {
    res.status(400).json({
      message: "You should login as an Academy"
    });
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
              res.status(400).json({
                message: "Error updating academy"
              });
            });
        } else {
          res.status(400).json({
            message: "Incorrect password"
          });
          return;
        }
      })
      .catch(err => {
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
          .json({
            message: "Academy updated. No password updated."
          });
      })
      .catch(err => {
        res.status(400).json({
          message: "Error updating academy"
        });
      });
  }
};

const erase = (req, res, next) => {
  const user = req.session.user;
  if (user) {
    Academy.findByIdAndRemove(user._id)
      .then(() => {
        req.session.destroy(function (err) {
          res.status(200).json({
            message: "Academy removed"
          });
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Error erasing academy"
        });
      });
  } else {
    res.status(400).json({
      message: "You are not logged in!"
    });
    return;
  }
};

module.exports = {
  loggedIn,
  logout,
  signup,
  login,
  getAll,
  getOne,
  getThis,
  update,
  erase
};