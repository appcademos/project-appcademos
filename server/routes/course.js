const express = require("express");
const router = express.Router();

const { getAll, create } = require("../api/course/course.controller");

router.get("/", getAll);
router.post("/create", create);

module.exports = router;
