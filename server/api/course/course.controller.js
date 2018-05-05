const Course = require("./course.model");
const debug = require("debug")("server:course.controller");

const getAll = (req, res, next) => {
  Course.find()
    .then(courses => {
      res.status(200).json({
        user: req.user || "not logged",
        courses
      });
    })
    .catch(err =>
      res.status(400).json({
        user: req.user || "not loged",
        message: "Error requesting courses",
        err
      })
    );
};

module.exports = getAll;
