const _ = require("lodash");
const Review = require("./review.model");
const User = require("../user/user.model");
const Course = require("../course/course.model");
const Academy = require("../academy/academy.model")
const debug = require("debug")("server:review.controller");
const fields = Object.keys(_.omit(Review.schema.paths, ["__v", "_id"]));

const getAll = (req, res, next) => {
  Review.find()
    .then(reviews => {
      res.status(200).json({ reviews });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Error requesting reviews" });
    });
};

const getOne = (req, res, next) => {
  Review.findById(req.params.id)
    .populate("author")
    .exec()
    .then(review => {
      res.status(200).json({ review });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Review not found" });
    });
};

const create = (req, res, next) =>
{
    const properties = _.pick(req.body, fields);
    const newReview = new Review(properties);

    newReview.save(err =>
    {
        if (err)
        {
            debug(err);
            res.status(400).json({ message: "Something went wrong when trying to create review" });
        }
        else
        {            
            res.status(201).json(newReview);
        }
    });
};

const update = (req, res, next) => {
  // Idea: Reviews can't be updated
  const updates = _.pick(req.body, fields);

  Review.findByIdAndUpdate(req.params.id, updates)
    .then(review => {
      res.status(200).json({ message: "Review updated." });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Error updating review" });
    });
};

const erase = (req, res, next) => {
  Review.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Review removed" });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({ message: "Error erasing review" });
    });
};

module.exports = { getAll, getOne, create, update, erase };
