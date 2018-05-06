const _ = require("lodash");
const Course = require("./course.model");
const debug = require("debug")("server:course.controller");
const fields = Object.keys(_.omit(Course.schema.paths, ["__v", "_id"]));

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

const create = (req, res, next) => {
  const properties = _.pick(req.body, fields);
  const newCourse = new Course(properties);

  newCourse.save(err => {
    if (err) {
      res.status(400).json({
        message: "Something went wrong when trying to create course"
      });
    } else {
      res.status(201).json({ message: "Course saved" });
    }
  });
};

module.exports = { getAll, create };
