require("dotenv").config();

const courseData = require("./course_data");
const Course = require("../api/course/course.model");
const Academy = require("../api/academy/academy.model");

module.exports =
{
    seedCourses: function()
    {
        Academy.findOne()
        .then(academy =>
        {
            courseData.map(course =>
            {
                course.academy = academy._id;
            });

            Course.collection.drop();

            Course.create(courseData)
            .then(() =>
            {
                console.log("Courses created");
            })
            .catch(err =>
            {
                console.log(err);
            });
        })
        .catch(error =>
        {
            console.log(error);
        });
    }
}
