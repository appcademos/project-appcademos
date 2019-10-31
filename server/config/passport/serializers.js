const passport = require("passport");
const User = require("../../api/user/user.model");
const Academy = require("../../api/academy/academy.model");

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then(userDocument => {
        passport.initialize({userProperty: "user"});
        cb(null, userDocument);
    })
    .catch(err => {
      cb(err);
      return;
    });
});
