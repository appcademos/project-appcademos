const express = require("express");
const router = express.Router();

const {
  getAll,
  getOne,
  create,
  update,
  erase
} = require("../api/course/course.controller");

router.get("/search", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.post("/create", create);
router.delete("/:id", erase);

module.exports = router;
