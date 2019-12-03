const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  getOne,
  create,
  update,
  erase
} = require("./review.controller");

router.get("/:id", [ Utils.hasAccess('adminAndAcademy'), getOne ]);
router.get("/", [ Utils.hasAccess('admin'), getAll ]);
router.put("/:id", [ Utils.hasAccess('adminAndAcademy'), update ]);
router.post("/", [ Utils.hasAccess('allRoles'), create ]);
router.delete("/:id", [ Utils.hasAccess('adminAndAcademy'), erase ]);

module.exports = router;
