const _ = require("lodash");
const Course = require("./course.model");
const User = require("../user/user.model");
const Review = require("../review/review.model");
const debug = require("debug")("server:course.controller");
const fields = Object.keys(_.omit(Course.schema.paths, ["__v", "_id"]));

const getAll = (req, res, next) => {

  let courseReviews = [];

  Course.find()
    .populate("academy")
    .then(courses => {
      return Promise.all(courses.map(course =>
          Review.find({
            academy: academy.id
          }).populate("author").then(reviews => {
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

const getSearched = (req, res, next) => {

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
          }).populate("author").then(reviews => {
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
      Review.find({
          course: course.id
        })
        .populate("author")
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
  if (req.academy) {
    if (req.academy.isVerified) {
      const properties = _.pick(req.body, fields);
      let newCourse = new Course(properties);
      newCourse.academy = req.academy.id;

      newCourse.save(err => {
        if (err) {
          res
            .status(400)
            .json({
              message: "Something went wrong when trying to create course"
            });
        } else {
          res.status(200).json({
            message: "Course saved"
          });
        }
      });
    } else {
      res.status(400).json({
        message: "You are not verified to create courses"
      });
    }
  } else {
    res.status(400).json({
      message: "You should login first"
    });
  }
};

const update = (req, res, next) => {
  const updates = _.pick(req.body, fields);

  Course.findById(req.params.id)
    .then(course => {
      if (course.academy === req.academy.id) {
        Course.update(req.params.id, updates)
          .then(() => {
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
      } else {
        res.status(400).json({
          message: "You can only edit your own courses"
        });
      }
    })
};

const erase = (req, res, next) => {
  Course.findById(req.params.id).then(course => {
    if (course.academy === req.academy.id) {
      Course.remove(req.params.id).then(() => {
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
            });
        })
        .catch(err => {
          debug(err);
          res.status(400).json({
            message: "Error erasing course"
          });
        });
    } else {
      res.status(400).json({
        message: "You can only erase your own courses"
      });
    }
  });
};

module.exports = {
  getAll,
  getSearched,
  getOne,
  create,
  update,
  erase
};