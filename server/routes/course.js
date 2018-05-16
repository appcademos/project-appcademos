const express = require("express");
const router = express.Router();

const {
  getAll,
  getSearched,
  getOne,
  create,
  update,
  erase
} = require("../api/course/course.controller");

router.get("/search", getSearched);
router.get("/all", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.post("/create", create);
router.delete("/:id", erase);

module.exports = router;
