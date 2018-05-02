const debug = require("debug")('routes:home');
const express = require("express");
const router = express.Router();
const path = require("path");

// Routes
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
