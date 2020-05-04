const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  create,
  update
} = require("./category.controller");

router.get("/", [ Utils.hasAccess('adminAndAcademy'), getAll ]);
router.post("/", [ Utils.hasAccess('admin'), create ]);
router.post("/:id/update", [ Utils.hasAccess('admin'), update ]);

module.exports = router;
