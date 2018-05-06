const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../api/user/user.model");
const Academy = require("../../api/academy/academy.model");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ email: username })
      .then(foundUser => {
        if (!foundUser) {
          Academy.findOne({ email: username })
            .then(foundUser => {
              if (!bcrypt.compareSync(password, foundUser.password)) {
                next(null, false, { message: "Incorrect password" });
                return;
              }
              next(null, foundUser);
            })
            .catch(err => {
              next(err);
              return;
            });
        } else {
          if (!bcrypt.compareSync(password, foundUser.password)) {
            next(null, false, { message: "Incorrect password" });
            return;
          }
          next(null, foundUser);
        }
      })
      .catch(err => {
        next(err);
        return;
      });
  })
);
