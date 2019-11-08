const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  getSearched,
  getOne,
  create,
  update,
  erase
} = require("./course.controller");

router.get("/search", getSearched);
router.get("/all", getAll);
router.get("/:id", getOne);
router.put("/:id", [ Utils.hasAccess('adminAndAcademy'), update ]);
router.post("/", [ Utils.hasAccess('adminAndAcademy'), create ]);
router.delete("/:id", [ Utils.hasAccess('adminAndAcademy'), erase ]);

module.exports = router;
