const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../api/user/user.model");
const Academy = require("../../api/academy/academy.model");
const bcrypt = require("bcrypt");

passport.use(
  "user-local",
  new LocalStrategy((username, password, next) => {
    passport.initialize({
      userProperty: "user"
    });
    User.findOne({
        email: username
      })
      .then(foundUser => {
        if (!foundUser) {
          next(null, false, {
            message: "User not found"
          });
          return;
        }
        if (!bcrypt.compareSync(password, foundUser.password)) {
          next(null, false, {
            message: "Incorrect password"
          });
          return;
        }
        next(null, foundUser);
      })
      .catch(err => {
        next(err);
        return;
      });
  })
);

passport.use(
  "academy-local",
  new LocalStrategy((username, password, next) => {
    passport.initialize({
      userProperty: "academy"
    });

    Academy.findOne({
        email: username
      })
      .then(foundAcademy => {
        if (!foundAcademy) {
          next(null, false, {
            message: "Academy not found"
          });
          return;
        }
        if (!bcrypt.compareSync(password, foundAcademy.password)) {
          next(null, false, {
            message: "Incorrect password"
          });
          return;
        }
        next(null, foundAcademy);
      })
      .catch(err => {
        next(err);
        return;
      });
  })
);