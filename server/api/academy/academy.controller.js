require("dotenv").config();

const Academy = require("./academy.model");
const debug = require("debug")("server:academy.controller");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = parseInt(process.env.BCRYPT);

const getAll = (req, res, next) => {
  Academy.find()
    .then(academies => {
      res.status(200).json({
        user: req.user || "not logged",
        academies
      });
    })
    .catch(err =>
      res.status(400).json({
        user: req.user || "not loged",
        message: "Error requesting academies",
        err
      })
    );
};

const create = (req, res, next) => {
  const { name, email } = req.body;
  const password = req.body.password;

  Academy.findOne({ email }, "email", (err, academy) => {
    if (academy !== null) {
      res.status(406).json({ message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newAcademy = new Academy({
      name,
      email,
      password: hashPass
    });

    newAcademy.save(err => {
      if (err) {
        res.status(400).json({ message: "Something went wrong" });
      } else {
        res.status(201).json({ message: "Academy saved" });
      }
    });
  });
};

module.exports = { getAll, create };
