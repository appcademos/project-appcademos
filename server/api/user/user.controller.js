require("dotenv").config();

const _ = require("lodash");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const passport = require("passport");
const bcryptSalt = parseInt(process.env.BCRYPT);
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
  if (req.user)
  {
      let returnUser = {...req.user._doc}
      delete returnUser.password;
      delete returnUser.__v;
      delete returnUser.created_at;
      delete returnUser.updated_at;
      res.status(200).json(returnUser);
  }
  else
  {
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

const signup = (req, res, next) =>
{
    let userData = _.pick(req.body, fields);

    if (userData.email === "" || userData.password === "")
    {
        res.status(401).json({ message: "Indicate email and password" });
        return;
    }

    User.findOne({ email: userData.email })
    .then(user =>
    {
        if (user !== null)
        {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        else
        {
            const salt = bcrypt.genSaltSync(bcryptSalt);
            userData.password = bcrypt.hashSync(userData.password, salt);

            const newUser = new User(userData);
            newUser.role = "student";

            return newUser
            .save()
            .then(user =>
            {    
                logInPromise(user, req)
                .then(user =>
                {
                    let returnUser = {...user._doc}
                    delete returnUser.password;
                    delete returnUser.__v;
                    delete returnUser.created_at;
                    delete returnUser.updated_at;
                    res.status(200).json(returnUser);
                });
            })
        }
    })
    .catch(e =>
    {
        debug(e);
        res.status(400).json({ message: "Something went wrong when creating the user", error: e })
    });
};

const login = (req, res, next) =>
{
    if (req.user)
    {
        return res.status(400).json({ message: "User already logged in" });
    }
    
    passport.authenticate("user-local", (err, user, info) =>
    {
        if (err)
          return next(err);
        if (!user)
          return res.status(400).json(info);
        
        logInPromise(user, req)
        .then(user =>
        {
            let returnUser = {...user._doc}
            delete returnUser.password;
            delete returnUser.__v;
            delete returnUser.created_at;
            delete returnUser.updated_at;
            res.status(200).json(returnUser);
        })
        .catch(err => debug(err));

    })(req, res, next);
}

const getThisUser = (req, res, next) => {
  if (req.user) {
    User.findById(req.user.id)
      .select("-password -__v -created_at -updated_at")
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


module.exports = {
  loggedIn,
  logout,
  signup,
  login,
  getThisUser,
  update
};