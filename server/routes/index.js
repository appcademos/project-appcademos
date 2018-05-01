const express = require("express");
const router = express.Router();
const path = require("path");

//Debug module
const app_path = require(`${path.join(
  path.dirname(__dirname),
  "package.json"
)}`);
const app_name = app_path.name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
