const _ = require("lodash");
const Course = require("./course.model");
const User = require("../user/user.model");
const Review = require("../review/review.model");
const debug = require("debug")("server:course.controller");
const fields = Object.keys(_.omit(Course.schema.paths, ["__v", "_id"]));

const getAll = (req, res, next) => {

  let courseReviews = [];
  let query = req.query.course.replace(/'+'/g, '[\s]');

  Course.find({
      $or: [{
        title: {
          $regex: query,
          $options: "i"
        }
      }, {
        tags: {
          $regex: query,
          $options: "i"
        }
      }]
    })
    .populate("academy")
    .then(courses => {
      return Promise.all(courses.map(course =>
          Review.find({
            course: course.id
          }).then(reviews => {
            for (let i = 0; i < reviews.length; i++) {
              if (reviews[i].course == course.id) {
                course.reviews.push(reviews[i]);
              }
            }
          })))
        .then(() => {
          res.status(200).json(courses)
        })
    })
    .catch(err => {
      res.status(400).json({
        message: "Error requesting courses"
      });
    });
};

const getOne = (req, res, next) => {
  Course.findById(req.params.id)
    .populate("academy")
    .populate("students")
    .exec()
    .then(course => {
      debug(course);
      Review.find({
          course: course.id
        })
        .then(reviews => {
          res.status(200).json({
            course,
            reviews
          });
        })
        .catch(err => {
          debug(err);
          res.status(400).json({
            message: "Error when retrieving reviews"
          });
        });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Course not found"
      });
    });
};

const create = (req, res, next) => {
  const properties = _.pick(req.body, fields);
  const newCourse = new Course(properties);

  newCourse.save(err => {
    if (err) {
      debug(err);
      res
        .status(400)
        .json({
          message: "Something went wrong when trying to create course"
        });
    } else {
      res.status(201).json({
        message: "Course saved"
      });
    }
  });
};

const update = (req, res, next) => {
  const updates = _.pick(req.body, fields);

  Course.findByIdAndUpdate(req.params.id, updates)
    .then(course => {
      res.status(200).json({
        message: "Course updated."
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Error updating course"
      });
    });
};

const erase = (req, res, next) => {
  Course.findByIdAndRemove(req.params.id).then(() => {
    Review.find({
        course: req.params.id
      })
      .remove()
      .then(() => {
        res.status(200).json({
          message: "Course removed"
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error erasing reviews"
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Error erasing course"
        });
      });
  });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  erase
};