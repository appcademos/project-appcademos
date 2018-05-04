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
const debug = require("debug")(`server:${path.basename(__dirname)}:express`);
const MongoStore = require("connect-mongo")(session);
const hashSecret = process.env.HASHCODE;
const dbURL = process.env.DBURL;

module.exports = app => {
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
  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Express View engine setup
  app.use(
    require("node-sass-middleware")({
      src: path.join(__dirname, "public"),
      dest: path.join(__dirname, "public"),
      sourceMap: true
    })
  );

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

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
};
