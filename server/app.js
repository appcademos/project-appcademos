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
const path = require("path");
const dbURL = process.env.DBURL;
const hashSecret = process.env.HASHCODE;
const app = express();

// Debug module
const app_path = require(`${path.join(
  path.dirname(__dirname),
  "server",
  "package.json"
)}`).name;
const debug = require("debug")(
  `${app_path}:${path.basename(__filename).split(".")[0]}`
);

// Activate CORS
const cors = require("cors");
const allowedOrigins = process.env.CORS_ALLOW;
let corsOptions = {
  origin: function(origin, isAllowed) {
    // Allow requests with no origin
    if (!origin) return isAllowed(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

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

// Default value for title local
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

// Define routes
const index = require("./routes/index");
const authRoutes = require("./routes/auth");

app.use("/", index);
app.use("/auth", authRoutes);

module.exports = app;
