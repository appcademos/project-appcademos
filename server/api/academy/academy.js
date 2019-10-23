const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  getOne,
  getThis,
  update
} = require("./academy.controller");

router.get("/:id", [ Utils.hasAccess('admin'), getOne ]);
router.get("/all", [ Utils.hasAccess('admin'), getAll ]);
router.get("/", [ Utils.hasAccess('academy'), getThis ]);
router.put("/update/:id", update);

module.exports = router;