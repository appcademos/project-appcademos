require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const debug = require("debug")(`${path.basename(__dirname)}:app`);
const MongoStore = require("connect-mongo")(session);
const hashSecret = process.env.HASHCODE;
const dbURL = process.env.DBURL;
const cors = require("cors");
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
var moment = require('moment');
var generateSitemap = require('./sitemap-generator.js');
const compression = require('compression');
var cron = require('node-cron');
const Course = require("./api/course/course.model")

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
app.use(compression());

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
app.use(express.static(path.join(__dirname, "dist")));

// Logger
app.use(logger("dev"));

app.locals.title = "yinius";

// Automatic integration webhook academy form
require('./routes/automatic-form-integration')(app)

require("./routes/routes")(app);
app.use(function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});


// Crons
cron.schedule('55 23 * * SUN', async () =>
{
    // Every sunday at 23:55 -> update all courses dates
    console.log('\nUpdating all courses dates...');
    
    let newDate = moment().add(8,'days').hour(8).minute(0).second(0).toISOString()
    console.log(`New date: ${newDate}`)
    let res = await Course.updateMany({}, {"$set":{"startDate": newDate}})
    console.log(res)
});


module.exports = app;
