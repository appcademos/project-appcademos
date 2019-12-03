const express = require("express");
const router = express.Router();
const Utils = require("../utils");

const {
  getAll,
  getOne,
  getThis,
  create,
  update,
  createReview
} = require("./academy.controller");

router.get("/", [ Utils.hasAccess('academy'), getThis ]);
router.get("/all", [ Utils.hasAccess('admin'), getAll ]);
router.get("/:id", [ Utils.hasAccess('adminAndAcademy'), getOne ]);
router.get("/", [ Utils.hasAccess('academy'), getThis ]);
router.post("/", [ Utils.hasAccess('admin'), create ]);
router.post("/:id/review", [ Utils.hasAccess('admin'), createReview ]);
router.put("/update/:id", update);

module.exports = router;