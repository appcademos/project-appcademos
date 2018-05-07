const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../api/user/user.model");
const Academy = require("../../api/academy/academy.model");
const bcrypt = require("bcrypt");

passport.use(
  "user-local",
  new LocalStrategy((username, password, next) => {
    User.findOne({ email: username })
      .then(foundUser => {
        if(!foundUser){
          next(null, false, { message: "User not found" });
          return;
        }
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
  })
);

passport.use(
  "academy-local",
  new LocalStrategy((username, password, next) => {
    Academy.findOne({ email: username })
      .then(academy => {
        if(!academy){
          next(null, false, { message: "Academy not found" });
          return;
        }
        if (!bcrypt.compareSync(password, academy.password)) {
          next(null, false, { message: "Incorrect password" });
          return;
        }
        next(null, academy);
      })
      .catch(err => {
        next(err);
        return;
      });
  })
);
