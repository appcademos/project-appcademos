require("dotenv").config();

const _ = require("lodash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../user/user.model");
const Academy = require("../academy/academy.model");
const Course = require("../course/course.model");
const Review = require("../review/review.model");
const Category = require("../category/category.model");
const debug = require("debug")("server:academy.controller");
const fields = Object.keys(_.omit(Academy.schema.paths, ["__v", "_id"]));
const bcryptSalt = parseInt(process.env.BCRYPT);
const salt = bcrypt.genSaltSync(bcryptSalt);

const {
  transporter,
  welcomeAcademy
} = require("../../config/nodemailer/transporter");


const getAll = (req, res, next) =>
{
    Academy.find()
        .select("-__v")
        .then(academies => { res.status(200).json(academies); })
        .catch(err => { res.status(500).json({ message: "Error requesting academies" }); });
};

const getOne = (req, res, next) =>
{
    Academy.findById(req.params.id)
    .select("-password")
    .populate('categories.category')
    .populate('neighborhoods')
    .populate(
    {
        path: 'reviews',
        populate:
        {
            path: 'author',
            model: 'User',
            select: '-__v -password'
        },
        options: { sort: { created_at: -1 } }
    })
    .then(async (academy) =>
    {
        if (academy != null)
        {            
            const courses = await Course.find({ academy: academy.id }).populate('category');
            
            if (courses != null)
            {
                let academyReturn = {...academy.toJSON(), courses: [...courses]}
                res.status(200).json(academyReturn);
            }
            else
                res.status(500).json({ message: "Error getting academy courses" });
        }
        else
            res.status(404).json({ message: "Academy not found" });
    })
    .catch(err =>
    {
        res.status(400).json({ message: "Academy not found" });
    });
};

const getThis = async (req, res, next) =>
{
    if (req.user)
    {
        const academy = await Academy.findOne({ user: req.user.id })
                                    .select("-__v")
                                    .populate('categories.category')
                                    .populate(
                                    {
                                        path: 'reviews',
                                        populate:
                                        {
                                            path: 'author',
                                            model: 'User',
                                            select: '-__v -password'
                                        },
                                        options: { sort: { created_at: -1 } }
                                    });
        
        if (academy != null)
        {            
            const courses = await Course.find({ academy: academy.id });
            
            if (courses != null)
            {
                let academyReturn = {...academy.toJSON(), courses: [...courses]}
                res.status(200).json(academyReturn);
            }
            else
                res.status(500).json({ message: "Error getting academy courses" });
        }
        else
            res.status(404).json({ message: "No academy found for this user" });
    }
    else
    {
        res.status(401).json(
        {
            message: "You should login first"
        });
    }
};

const create = async (req, res, next) =>
{
    let props = {...req.body}
    const categories = await Category.find({});
    props.categories = []
    
    if (categories != null && categories.length > 0)
    {
        categories.forEach(category =>
        {
            props.categories.push(
                            {
                                category: category._id
                            });
        });
        
        let newAcademy = new Academy(props);

        newAcademy.save(err =>
        {            
            if (err)
                res.status(400).json({ message: "Something went wrong when trying to create the academy", error: err });
            else
                res.status(200).json({ message: "Academy created" });
        });
    }
    else
    {
        res.status(400).json({ message: "Something went wrong when trying to create the academy: categories error" });
    }
};

const update = (req, res, next) =>
{
    let updates = _.pick(req.body, fields);

    updates = _.omit(updates, ["password"]);
        
    Academy.findByIdAndUpdate(req.params.id, updates, { runValidators: true })
    .then(academy =>
    {
        Academy.findById(req.params.id)
        .populate(
        {
            path: 'reviews',
            model: 'Review'
        })
        .then(academy =>
        {                
            // Update the averageRating
            if (academy.reviews != null)
            {
                let averageRating = 0;
                let numReviews = 0;
                
                academy.reviews.forEach((review) =>
                {
                    if (review.grade == null)
                        return
                    
                    numReviews++
                    averageRating += review.grade;
                });
                
                if (averageRating > 0)
                    averageRating = averageRating / numReviews;
                    
                Academy.findByIdAndUpdate(req.params.id, { averageRating: averageRating })
                .then(acad =>
                {
                    res.status(200).json({ message: "Academy updated." });
                })
                .catch((error) =>
                {
                    console.log('ERROR: Could not update averageRating', error);
                    
                    res.status(200).json({ message: "Academy updated." });
                });
            }
        })
        .catch(err =>
        {
            console.log('ERROR: Could not update averageRating', err);
            
            res.status(200).json({message: "Academy updated. No password updated."});
        });
    })
    .catch(err =>
    {
        res.status(400).json({message: "Error updating academy"});
    });
};

const createReview = async (req, res, next) =>
{
    try
    {
        let academy = await Academy.findById(req.params.id).populate('reviews');
        
        if (academy != null)
        {
            const newReview = new Review(req.body);
            await newReview.save();
            
            if (newReview != null)
            {
                let reviews = academy.reviews;
                reviews.push(newReview._id);
                await Academy.findByIdAndUpdate(req.params.id, { reviews: reviews });
                
                // Update the averageRating
                if (academy.reviews != null)
                {
                    let averageRating = newReview.grade;
                    let numReviews = 1;
                    
                    academy.reviews.forEach((review) =>
                    {
                        if (review.grade == null)
                            return
                            
                        numReviews++
                        averageRating += review.grade;
                    });
                    
                    if (averageRating > 0)
                        averageRating = averageRating / numReviews;

                    Academy.findByIdAndUpdate(req.params.id, { averageRating: averageRating })
                    .then(acad =>
                    {
                        res.status(200).json({ message: "Review created." });
                    })
                    .catch((error) =>
                    {
                        console.log('ERROR: Could not update averageRating', error);
                        
                        res.status(200).json({ message: "Review created." });
                    });
                }
            }
            else
                res.status(400).json({message: "Error creating review"});
        }
        else
            res.status(404).json({message: "Academy not found"});
    }
    catch(error)
    {
        res.status(400).json({message: "Error creating review"});
    }
};

const deleteReview = async (req, res, next) =>
{
    try
    {
        let academy = await Academy.findById(req.params.id).populate('reviews');
        
        if (academy != null)
        {
            await Review.findByIdAndRemove(req.body.reviewId)
            
            let reviews = []
            academy.reviews.forEach(r =>
            {
                if (r != null && r._id != req.body.reviewId && r.grade != null)
                    reviews.push(r._id)
            })

            await Academy.findByIdAndUpdate(req.params.id, { reviews: reviews });
            
            // Update the averageRating
            if (academy.reviews != null)
            {
                let averageRating = 0
                let numReviews = 0
                
                academy.reviews.forEach((review) =>
                {
                    if (review._id == req.body.reviewId || review.grade == null)
                        return
                        
                    numReviews++
                    averageRating += review.grade
                })
                
                if (averageRating > 0)
                    averageRating = averageRating / numReviews

                Academy.findByIdAndUpdate(req.params.id, { averageRating: averageRating })
                .then(acad =>
                {
                    res.status(200).json({ message: "Review deleted." })
                })
                .catch((error) =>
                {
                    console.log('ERROR: Could not update averageRating', error)
                    
                    res.status(200).json({ message: "Review deleted." })
                })
            }
        }
        else
            res.status(404).json({message: "Academy not found"})
    }
    catch(error)
    {
        res.status(400).json({message: "Error deleting review"})
    }
};


module.exports = {
  getAll,
  getOne,
  getThis,
  create,
  update,
  createReview,
  deleteReview
};
