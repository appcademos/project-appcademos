require("dotenv").config();

const{
  transporter,
  welcomeMail,
  paymentMail
}=require("../../config/nodemailer/transporter");

const _ = require("lodash");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const passport = require("passport");
const bcryptSalt = parseInt(process.env.BCRYPT);
const debug = require("debug")("server:user.controller");
const fields = Object.keys(_.omit(User.schema.paths, ["__v", "_id"]));


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

        welcomeMail.to=email;
        transporter.sendMail(welcomeMail)
        .then(info=> debug(info))
        .catch(err=> debug(err));

      }
    });
  });
};

const logout = (req, res) => {
  const user = req.user;
  if (user) {
    req.session.destroy(function(err) {
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
        req.session.destroy(function(err) {
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

module.exports = { login, signup, logout, getThisUser, getUser, update, erase };
