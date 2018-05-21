const express = require("express");
const router = express.Router();

const {
  loggedIn,
  logout,
  signup,
  login,
  getAll,
  getOne,
  getThis,
  update,
  erase
} = require("./academy.controller");

router.get("/session", loggedIn);
router.get("/logout", logout);
router.get("/single/:id", getOne);
router.get("/all", getAll);
router.get("/", getThis);
router.put("/update/:id", update);
router.post("/login", login);
router.post("/signup", signup);
router.delete("/", erase);

module.exports = router;