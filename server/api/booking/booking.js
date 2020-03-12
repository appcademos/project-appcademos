const express = require("express");
const router = express.Router();

const {
  create,
  update
} = require("./booking.controller");

router.post("/", create);
router.put("/:id", update);

module.exports = router;