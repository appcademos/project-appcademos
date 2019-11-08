const _ = require("lodash");
const Course = require("./course.model");
const User = require("../user/user.model");
const Review = require("../review/review.model");
const Category = require("../category/category.model");
const debug = require("debug")("server:course.controller");
const fields = Object.keys(_.omit(Course.schema.paths, ["__v", "_id"]));
const mongoose = require("mongoose");

const getAll = (req, res) => {

    let courseReviews = [];

    Course.find()
    .populate(
    {
        path: 'academy',
        populate:
        {
            path: 'reviews',
            model: 'Review'
        }
    })
    .populate('category')
    .then(courses =>
    {
        res.status(200).json(courses);
        /*return Promise.all(courses.map(course =>
        {
            Review.find({ academy: academy.id })
            .populate("author").then(reviews =>
            {
                for (let i = 0; i < reviews.length; i++)
                {
                    if (reviews[i].course == course.id)
                    {
                        course.reviews.push(reviews[i]);
                    }
                }
            })))
            .then(() =>
            {
                res.status(200).json(courses);
            })
        }*/
    })
    .catch(err =>
    {
        console.log(error);
        res.status(400).json(
        {
            message: "Error requesting courses"
        });
    });
};

const getSearched = async (req, res, next) =>
{
    let courseReviews = [];
    let query = req.query.course.replace(/'+'/g, '[\s]').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let findObj = {}
    
    const categories = await Category.find({});
    let foundCategory = null;
    
    if (categories != null && categories.length > 0)
        foundCategory = categories.find(category => category.name.toLowerCase() == query.toLowerCase());
        
    if (foundCategory != null)
    {
        findObj =
        {
            category: foundCategory._id
        }
    }
    else
    {
        findObj = 
        {
            title:
            {
                $regex: query,
                $options: "i"
            }
        }
    }
    
    Course.find(findObj)
    .populate(
    {
        path: 'academy',
        populate:
        {
            path: 'reviews',
            model: 'Review'
        }
    })
    .populate('category')
    .then(courses =>
    {
        return Promise.all(courses.map(course =>
        
            Review.find({ course: course.id })
            .populate("author")
            .then(reviews =>
            {
                for (let i = 0; i < reviews.length; i++)
                {
                    if (reviews[i].course == course.id)
                        course.reviews.push(reviews[i]);
                }
            })
        ))
        .then(() => { res.status(200).json(courses) })
    })
    .catch(err =>
    {
        console.log(err);
        res.status(400).json({ message: "Error requesting courses" });
    });
};

const getOne = (req, res, next) => {
  Course.findById(req.params.id)
    .populate(
      {
          path: 'academy',
          populate:
          {
              path: 'reviews',
              model: 'Review',
              options: { sort: { "created_at": "descending" } },
              populate:
              {
                  path: 'author',
                  model: 'User'
              }
          }
      })
    .populate("category")
    .populate("students")
    .exec()
    .then(course => {
        res.status(200).json({ course });
        
        // We keep the updated_at field so that mongoose doesn't overwrite it
        Course.updateOne({ _id: req.params.id }, { impressions: course.impressions+1, updated_at: course.updated_at })
        .then(res =>
        {
            console.log('Course impressions +1', res);
        })
        .catch(error =>
        {
            console.log(error);
        });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Course not found"
      });
    });
};

const create = (req, res, next) =>
{
    if (req.body.academy != null)
    {
        const properties = _.pick(req.body, fields);
        let newCourse = new Course(properties);
        newCourse.academy = properties.academy;

        newCourse.save(err =>
        {
            if (err)
              res.status(400).json({ message: "Something went wrong when trying to create course" });
            else
                res.status(200).json({ message: "Course saved" });
          });
    }
    else
    {
        res.status(400).json({ message: "academy is missing" });
    }
};

const update = (req, res, next) =>
{
    const updates = _.pick(req.body, fields);

    console.log(updates);

    Course.findById(req.params.id)
    .then(course =>
    {
        if (req.user.role == 'admin' || req.user.role == 'academy')
        {
            Course.update({ _id: req.params.id }, { $set: { ...updates } })
            .then(() =>
            {
                res.status(200).json({ message: "¡Curso actualizado!" });
            })
            .catch(err =>
            {
                debug(err);
                res.status(500).json({ message: "Error al actualizar el curso" });
            });
        }
        /*else
        {
            res.status(401).json({ message: "Solo puedes editar tus propios cursos" });
        }*/
    });
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
