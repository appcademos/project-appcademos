const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")(`server:${path.basename(__dirname)}:express`);

// Routes
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
