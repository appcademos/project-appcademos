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

const update = (req, res, next) =>
{
    const updates = _.pick(req.body, fields);

    Review.findByIdAndUpdate(req.params.id, updates)
    .then(async (review) =>
    {
        if (updates.created_at != null)
        {
            review.created_at = updates.created_at;
            
            try
            {
                let savedReview = await review.save();
                if (savedReview != null)
                {
                    // Update academy averageRating
                    let academy = await Academy.findOne({ reviews: req.params.id }).populate('reviews')
                    if (academy != null && academy.reviews != null)
                    {
                        let averageRating = 0
                        let numReviews = 0
                        
                        academy.reviews.forEach((review) =>
                        {
                            if (review.grade == null)
                                return
                                
                            numReviews++
                            averageRating += review.grade
                        })
                        
                        if (averageRating > 0)
                            averageRating = averageRating / numReviews

                        Academy.findByIdAndUpdate(academy._id, { averageRating: averageRating })
                        .then(acad =>
                        {
                            res.status(200).json({ message: "Review updated." })
                        })
                        .catch((error) =>
                        {
                            console.log('ERROR: Could not update averageRating', error)
                            
                            res.status(200).json({ message: "Review updated." })
                        })
                    }
                    else
                        res.status(200).json({ message: "Review updated." })
                }
            }
            catch(saveErr)
            {
                debug(saveErr);
            }
        }
        else
            res.status(200).json({ message: "Review updated." });
    })
    .catch(err =>
    {
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
