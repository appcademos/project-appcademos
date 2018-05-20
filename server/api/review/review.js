const express = require("express");
const router = express.Router();

const {
  getAll,
  getOne,
  create,
  update,
  erase
} = require("./review.controller");

router.get("/:id", getOne);
router.get("/", getAll);
router.put("/:id", update);
router.post("/create", create);
router.delete("/:id", erase);

module.exports = router;
