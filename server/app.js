require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const debug = require("debug")(`${path.basename(__dirname)}:app`);
const MongoStore = require("connect-mongo")(session);
const hashSecret = process.env.HASHCODE;
const dbURL = process.env.DBURL;
const cors = require("cors");
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const Review = require("./api/review/review.model");
const User = require("./api/user/user.model");
var moment = require('moment');
var generateSitemap = require('./sitemap-generator.js');

mongoose.Promise = Promise;
mongoose
.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, setDefaultsOnInsert: true })
.then(() =>
{
    debug(`Connected to Mongo at ${dbURL}`);
    
    // Generate sitemap.xml every day
    generateSitemap();
    setInterval(() =>
    {
        generateSitemap();
    }, 24*60*60*1000);
})
.catch(err =>
{
    debug("Error connecting to mongo", err);
});

const app = express();

if (process.env.ENV != 'development')
    app.use(redirectToHTTPS(undefined, [/\/app/], 301));

var whitelist = [
  `${process.env.CORS_ALLOW}`,
  'http://localhost'
];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

// Middleware Setup
app.use(logger("dev"));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Enable authentication using session + passport
app.use(
  session({
    secret: hashSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    ttl: 48 * 60 * 60 // 2 days
  })
);
require("./config/passport")(app);

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.locals.title = "Appcademos";

require("./routes/routes")(app);
app.use(function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
