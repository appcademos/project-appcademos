const express = require("express");
const router = express.Router();

const {
  getAll,
  getOne,
  signup,
  update,
  erase
} = require("../api/academy/academy.controller");

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/signup", signup);
router.put("/:id", update);
router.delete("/:id", erase);

module.exports = router;
