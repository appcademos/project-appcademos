require("dotenv").config();

const _ = require("lodash");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const passport = require("passport");
const bcryptSalt = parseInt(process.env.BCRYPT);
const Academy = require("../academy/academy.model");
const debug = require("debug")("server:user.controller");
const fields = Object.keys(_.omit(User.schema.paths, ["__v", "_id"]));

const {
  transporter,
  welcomeMail,
  paymentMail
} = require("../../config/nodemailer/transporter");

const logInPromise = (user, req) => {
  return new Promise((resolve, reject) => {
    req.login(user, err => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
};

const loggedIn = (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(400).json({
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
    email,
    password
  } = req.body;

  if (email === "" || password === "") {
    res.status(401).json({
      message: "Indicate email and password"
    });
    return;
  }

  User.findOne({
      email
    })
    .then(user => {
      if (user !== null) {
        res.status(409).json({
          message: "User already exists"
        });
        return;
      } else {
        Academy.findOne({
            email
          })
          .then(user => {
            if (user !== null) {
              res.status(409).json({
                message: "Email already registered"
              });
              return;
            } else {

              const salt = bcrypt.genSaltSync(bcryptSalt);
              const hashPass = bcrypt.hashSync(password, salt);

              const newUser = new User({
                email,
                password: hashPass
              });

              return newUser
                .save()
                .then(user => {

                  logInPromise(user, req)
                    .then(user => res.status(200).json(user));
                })
            }
          })
      }
    })
    .catch(e =>
      res
      .status(400)
      .json({
        message: "Something went wrong when trying to find user"
      })
    );
};

const login = (req, res, next) => {
  if (req.user) {
    return res.status(400).json({
      message: "User already logged in"
    });
  }
  passport.authenticate("user-local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json(info);
    }
    logInPromise(user, req)
      .then(user => res.status(200).json(user)).catch(err => debug("132", err));

  })(req, res, next);
}

const getThisUser = (req, res, next) => {
  if (req.user) {
    User.findById(req.user.id)
      .select("-password")
      .then(user => {
        res.status(200).json(
          user
        );
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error retrieving user"
        });
      });
  } else {
    res.status(400).json({
      message: "You should login first"
    });
  }
};

// View other user's profile
const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .select("-password")
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Error retrieving user"
      });
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
              res.status(500).json({
                message: "Error updating user"
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
        debug(err);
        res.status(500).json({
          message: "Error updating user"
        });
      });
  } else {
    updates = _.omit(updates, ["password"]);

    User.findByIdAndUpdate(req.user.id, updates)
      .then(user => {
        res.status(200).json({
          message: "User updated. Password not updated."
        });
      })
      .catch(err => {
        debug(err);
        res.status(500).json({
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
          res.status(200).json({
            message: "User removed"
          });
        });
      })
      .catch(err => {
        debug(err);
        res.status(500).json({
          message: "Error when erasing user"
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
  getThisUser,
  getUser,
  update,
  erase
};