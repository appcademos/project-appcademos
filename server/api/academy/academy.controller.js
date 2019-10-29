require("dotenv").config();

const _ = require("lodash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../user/user.model");
const Academy = require("../academy/academy.model");
const Course = require("../course/course.model");
const Review = require("../review/review.model");
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

const getOne = (req, res, next) => {
  Academy.findById(req.params.id)
    .select("-password")
    .then(academy => {
      res.status(200).json({
        academy
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Academy not found"
      });
    });


};

const getThis = async (req, res, next) =>
{
    if (req.user)
    {
        const academy = await Academy.findOne({ user: req.user.id })
                                    .select("-__v")
                                    .populate('categories.category');
        
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

const update = (req, res, next) =>
{
    let updates = _.pick(req.body, fields);

    if (req.body.newPassword)
    {
        Academy.findById(req.academy.id)
        .then(academy =>
        {
            if (bcrypt.compareSync(req.body.password, academy.password))
            {
                const hashPass = bcrypt.hashSync(req.body.newPassword, salt);
                updates.password = hashPass;

                Academy.update(updates)
                .then(academy =>
                {
                    res.status(200).json({message: "Academy updated. Password updated."});
                })
                .catch(err =>
                {
                    res.status(400).json({message: "Error updating academy"});
                });
            }
            else
            {
                res.status(400).json({message: "Incorrect password"});
                return;
            }
        })
        .catch(err =>
        {
            res.status(400).json({message: "Error updating academy"});
        });
    }
    else
    {
        updates = _.omit(updates, ["password"]);
        
        Academy.findByIdAndUpdate(req.params.id, updates)
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
                    
                    academy.reviews.forEach((review) =>
                    {
                        averageRating += review.grade;
                    });
                    
                    if (averageRating > 0)
                        averageRating = averageRating / academy.reviews.length;
                        
                    Academy.findByIdAndUpdate(req.params.id, { averageRating: averageRating })
                    .then(acad =>
                    {
                        res.status(200).json({message: "Academy updated. No password updated."});
                    })
                    .catch((error) =>
                    {
                        console.log('ERROR: Could not update averageRating');
                        
                        res.status(200).json({message: "Academy updated. No password updated."});
                    });
                }
            })
            .catch(err =>
            {
                console.log('ERROR: Could not update averageRating');
                
                res.status(200).json({message: "Academy updated. No password updated."});
            });
        })
        .catch(err =>
        {
            res.status(400).json({message: "Error updating academy"});
        });
    }
};


module.exports = {
  getAll,
  getOne,
  getThis,
  update
};
