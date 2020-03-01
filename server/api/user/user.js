const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./user.model");

const {
  loggedIn,
  logout,
  signup,
  login,
  getThisUser,
  update
} = require("./user.controller");

router.get("/session", loggedIn);
router.get("/logout", logout);
router.get("/", getThisUser);
router.put("/update/:id", update);
router.post("/login", login);
router.post("/signup", signup);

// /user/auth/facebook/login?access_token={FB_ACCESS_TOKEN}
router.get("/auth/facebook/login", passport.authenticate('facebook-token-login'),
    (req, res) =>
    {
        if (req.user)
        {
            let userToSend = { ...req.user._doc }
            delete userToSend.__v;
            delete userToSend.password;
            delete userToSend.created_at;
            delete userToSend.updated_at;
            
            res.status(200).json(userToSend);
        }
        else
            res.sendStatus(401);
    },
    (error, req, res, next) =>
    {
        if (error)
        {
            let status = error.status ? error.status : 401;
            
            res.status(status)
            .json(
            {
                success: false,
                message: error.message ? error.message : 'Error de autenticación'
            });
        }
    });
    
router.get("/auth/facebook/signup", passport.authenticate('facebook-token-signup'),
    (req, res) =>
    {
        if (req.user)
        {
            let userToSend = { ...req.user._doc }
            delete userToSend.__v;
            delete userToSend.password;
            delete userToSend.created_at;
            delete userToSend.updated_at;
            
            res.status(200).json(userToSend);
        }
        else
            res.sendStatus(401);
    },
    (error, req, res, next) =>
    {
        if (error)
        {
            let status = error.status ? error.status : 401;
            
            res.status(status)
            .json(
            {
                success: false,
                message: error.message ? error.message : 'Error de autenticación'
            });
        }
    });

module.exports = router;
