const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-token-google2').Strategy;
const User = require("../../api/user/user.model");
const bcrypt = require("bcrypt");
const debug = require("debug")("server:passport.strategy");

const fbClientId = process.env.FACEBOOK_CLIENT_ID;
const fbClientSecret = process.env.FACEBOOK_CLIENT_SECRET;
const fbGraphVersion = "v3.0";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.use("user-local",
    new LocalStrategy((username, password, next) =>
    {
        passport.initialize({ userProperty: "user" });

        User.findOne({ email: username })
        .then(foundUser =>
        {
            if (!foundUser)
            {
                next(null, false, { message: "User not found" });
            }

            if (!bcrypt.compareSync(password, foundUser.password))
            {
                next(null, false, { message: "Incorrect password" });
                return;
            }

            next(null, foundUser);
        })
        .catch(err =>
        {
            next(err);
            return;
        });
    })
);


passport.use('facebook-token-login', new FacebookTokenStrategy(
{
    clientID: fbClientId,
    clientSecret: fbClientSecret,
    fbGraphVersion: fbGraphVersion
},
async (accessToken, refreshToken, profile, done) =>
{        
    try
    {
        let user = await User.findOne({ $or: [
                                                { facebookId: profile.id },
                                                { email: profile.emails[0].value }
                                             ]});
                                             
        if (user != null)
        {
            // Return user
            let returnUser = user;

            if (user.facebookId == null)
            {
                let updateData = { facebookId: profile.id }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }
            
            if (profile.photos != null && profile.photos.length > 0 && profile.photos[0].value != user.imageUrl)
            {
                let updateData = { imageUrl: profile.photos[0].value }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }

            done(null, returnUser);
        }
        else
        {
            let error = new Error('El usuario no tiene una cuenta creada');
            error.status = 404;
            done(error, null);
        }
    }
    catch(e)
    {
        debug(e);
        done({ message: "No ha podido completarse el login con Facebook", error: e }, null);
    }
}));

passport.use('facebook-token-signup', new FacebookTokenStrategy(
{
    clientID: fbClientId,
    clientSecret: fbClientSecret,
    fbGraphVersion: fbGraphVersion
},
async (accessToken, refreshToken, profile, done) =>
{        
    try
    {
        let user = await User.findOne({ $or: [
                                                { facebookId: profile.id },
                                                { email: profile.emails[0].value }
                                             ]});
                                             
        if (user != null)
        {
            // Return user
            let returnUser = user;

            if (user.facebookId == null)
            {
                let updateData = { facebookId: profile.id }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }
            
            if (profile.photos != null && profile.photos.length > 0 && profile.photos[0].value != user.imageUrl)
            {
                let updateData = { imageUrl: profile.photos[0].value }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }

            done(null, returnUser);
        }
        else
        {
            // Create user and return it
            
            let userData =
            {
                facebookId: profile.id,
                role: 'student',
                name: (profile.name != null && profile.name.givenName != null && profile.name.givenName.length > 0 ) ? profile.name.givenName : profile.displayName,
                lastName: (profile.name != null && profile.name.familyName != null && profile.name.familyName.length > 0 ) ? profile.name.familyName : '',
                email: profile.emails[0].value,
                imageUrl: (profile.photos.length > 0) ? profile.photos[0].value : null
            }
            const newUser = new User(userData);

            let createdUser = await newUser.save();
            
            done(null, createdUser);
        }
    }
    catch(e)
    {
        debug(e);
        done({ message: "No ha podido completarse el signup con Facebook", error: e }, null);
    }
}));


passport.use('google-token-login', new GoogleStrategy(
{
    clientID: googleClientId,
    clientSecret: googleClientSecret
},
async (accessToken, refreshToken, profile, done) =>
{        
    try
    {    
        let user = await User.findOne({ $or: [
                                                { googleId: profile.id },
                                                { email: profile.emails[0].value }
                                             ]});
                                             
        if (user != null)
        {
            // Return user
            let returnUser = user;

            if (user.googleId == null)
            {
                let updateData = { googleId: profile.id }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }
            
            if (profile._json.picture != null && profile._json.picture != user.imageUrl)
            {
                let updateData = { imageUrl: profile._json.picture }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }

            done(null, returnUser);
        }
        else
        {
            let error = new Error('El usuario no tiene una cuenta creada');
            error.status = 404;
            done(error, null);
        }
    }
    catch(e)
    {
        debug(e);
        done({ message: "No ha podido completarse el login con Google", error: e }, null);
    }
}));

passport.use('google-token-signup', new GoogleStrategy(
{
    clientID: googleClientId,
    clientSecret: googleClientSecret
},
async (accessToken, refreshToken, profile, done) =>
{        
    try
    {    
        let user = await User.findOne({ $or: [
                                                { googleId: profile.id },
                                                { email: profile.emails[0].value }
                                             ]});
                                             
        if (user != null)
        {
            // Return user
            let returnUser = user;

            if (user.googleId == null)
            {
                let updateData = { googleId: profile.id }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }
            
            if (profile._json.picture != null && profile._json.picture != user.imageUrl)
            {
                let updateData = { imageUrl: profile._json.picture }
                returnUser = await User.findOneAndUpdate({ email: user.email }, updateData);
            }

            done(null, returnUser);
        }
        else
        {
            // Create user and return it
            
            let userData =
            {
                googleId: profile.id,
                role: 'student',
                name: (profile.name != null && profile.name.givenName != null && profile.name.givenName.length > 0 ) ? profile.name.givenName : profile.displayName,
                lastName: (profile.name != null && profile.name.familyName != null && profile.name.familyName.length > 0 ) ? profile.name.familyName : '',
                email: profile.emails[0].value,
                imageUrl: (profile._json.picture != null) ? profile._json.picture : null
            }
            const newUser = new User(userData);

            let createdUser = await newUser.save();
            
            done(null, createdUser);
        }
    }
    catch(e)
    {
        debug(e);
        done({ message: "No ha podido completarse el signup con Google", error: e }, null);
    }
}));