require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const dbURL = process.env.DBURL;
const hashSecret = process.env.HASH_CODE;
const app = express();
const cors = require('cors');
var corsOptions = {
  origin: `${process.env.HOST}:${process.env.PORT}`,
  optionsSuccessStatus: 200 
}

const path = require("path");

//Debug module
const app_path = require(`${path.join(
  path.dirname(__dirname),
  "server",
  "package.json"
)}`);
const app_name = app_path.name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

mongoose.Promise = Promise;
mongoose
.connect(dbURL)
.then(() => {
  debug(`Connected to Mongo at ${dbURL}`);
})
.catch(err => {
  debug("Error connecting to mongo", err);
});

// Middleware Setup
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

// default value for title local
app.locals.title = "Appcademos";

// Enable authentication using session + passport
app.use(
  session({
    secret: hashSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
require("./passport")(app);

const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

module.exports = app;
