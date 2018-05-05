const express = require("express");
const router = express.Router();

const getAll = require("../api/course/course.controller");

router.get("/", getAll);

module.exports = router;
