const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  update
} = require("./category.controller");

router.get("/", [ Utils.hasAccess('admin'), getAll ]);
router.post("/:id/update", [ Utils.hasAccess('admin'), update ]);

module.exports = router;
