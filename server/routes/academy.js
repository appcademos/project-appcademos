const express = require("express");
const router = express.Router();

const {
  getAll,
  getOne,
  signup,
  update,
  erase
} = require("../api/academy/academy.controller");

router.get("/:id", getOne);
router.get("/", getAll);
router.post("/signup", signup);
router.put("/:id", update);
router.delete("/", erase);

module.exports = router;
