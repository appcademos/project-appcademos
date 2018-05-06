const express = require("express");
const router = express.Router();

const {
  getAll,
  getOne,
  create,
  update,
  erase
} = require("../api/review/review.controller");

router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.post("/create", create);
router.delete("/:id", erase);

module.exports = router;