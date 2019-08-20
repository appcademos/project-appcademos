const express = require("express");
const router = express.Router();

const {
  create
} = require("./booking.controller");

router.post("/", create);

module.exports = router;