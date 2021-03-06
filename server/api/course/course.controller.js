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

    Course.find({ hidden: {$ne: true} })
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
    console.log(req.query)
    
    let courseReviews = [];
    // query.course = course Category
    let query = req.query.course.replace(/'+'/g, '[\s]').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let city = req.query.city ? req.query.city : null
    let neighborhoods = req.query.neighborhoods ? JSON.parse(req.query.neighborhoods) : null;
    let findObj = { hidden: {$ne: true} }
    let limit = req.query.limit ? parseInt(req.query.limit) : null
    
    const categories = await Category.find({});
    let foundCategory = null;
    
    if (categories != null && categories.length > 0)
        foundCategory = categories.find(category => category.name.toLowerCase().replace(/ñ/g,'n') == query.toLowerCase());
        
    if (foundCategory != null)
    {
        findObj.category = foundCategory._id;
    }
    else
    {
        findObj.title =
        {
            $regex: query,
            $options: "i"
        }
    }
    
    // Set modality
    if (req.query.modality != null &&
        req.query.modality.length > 0 &&
        req.query.modality !== 'null' &&
        req.query.modality !== 'todos')
        findObj.modality = req.query.modality
    
    Course.find(findObj, null, {limit: limit})
    .populate(
    {
        path: 'academy',
        populate:
        [
            {
                path: 'reviews',
                model: 'Review'
            },
            {
                path: 'neighborhoods',
                model: 'Neighborhood'
            }
        ]
    })
    .populate('category')
    .then(courses =>
    {
        if (city)
        {
            courses = courses.filter(course =>
            {
                let courseHasCity = (course.academy.neighborhoods != null &&
                                     course.academy.neighborhoods
                                     .some(n =>
                                     {
                                         return n.city.toString() === city
                                     }))
                return courseHasCity
            })
        }
        else if (neighborhoods)
        {
            courses = courses.filter(course =>
            {
                let courseHasNeigh = (course.academy.neighborhoods != null &&
                                      course.academy.neighborhoods
                                      .some(n =>
                                      {
                                          return neighborhoods.includes(n._id.toString())
                                      }))
                return courseHasNeigh
            })
        }
        
        courses.forEach(course =>
        {
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
        });
        
        res.status(200).json(courses);
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
                  model: 'User',
                  select: '-password -__v -created_at -updated_at'
              }
          }
      })
    .populate("category")
    .populate("students")
    .exec()
    .then(course => 
    {
        if (course.hidden)
        {
            res.sendStatus(404);
            return;
        }
        
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

const erase = (req, res, next) =>
{    
    Course.findById(req.params.id).then(course =>
    {
        debug(course.academy.user);
        
        if (req.user.role === 'admin' ||
            (req.user.role === 'academy' && course.academy.user === req.user._id))
        {
            Course.remove({ _id: req.params.id }).then(() =>
            {
                res.status(200).json({ message: "Course deleted" });
            })
            .catch(err =>
            {
                debug(err);
                res.status(400).json({ message: "Error deleting course" });
            });
        }
        else
        {
            res.status(400).json({ message: "You can only delete your own courses" });
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
