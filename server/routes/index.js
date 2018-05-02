const express = require("express");
const router = express.Router();
const path = require("path");

// Debug module
const index_path = require(`${path.join(
  path.dirname(__dirname),
  "package.json"
)}`).name;
const debug = require("debug")(
  `${index_path}:${path.basename(__filename).split(".")[0]}`
);

// Routes
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
