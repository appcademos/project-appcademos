require("dotenv").config();

const dbURL = process.env.DBURL;
const mongoose = require("mongoose");
const courseData = require("./course_data");
const Course = require("../api/course/course.model");

mongoose
  .connect(dbURL)
  .then(() => {
    Course.collection.drop();

    Course.create(courseData)
      .then(() => {
        console.log("Courses created");
        mongoose.disconnect();
      })
      .catch(err => console.log(err));
  })
  .catch(err => {
    console.log("Error connecting to mongo", err);
  });
