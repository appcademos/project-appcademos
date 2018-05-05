const express = require("express");
const router = express.Router();

const { getAll, create } = require("../api/academy/academy.controller");

router.get("/", getAll);

router.post("/", create);

module.exports = router;
