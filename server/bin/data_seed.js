const academyData = require("./academy_data");
const courseData = require("./course_data");
const userData = require("./user_data");
const reviewData = require("./review_data");

const Academy = require("../api/academy/academy.model");
const Course = require("../api/course/course.model");
const User = require("../api/user/user.model");
const Review = require("../api/review/review.model");

module.exports =
{
    seed: function()
    {
        User.collection.drop();
        Review.collection.drop();
        Academy.collection.drop();
        Course.collection.drop();

        User.create(userData)
        .then(() =>
        {
            console.log("Users created");

            // Seed reviews
            User.findOne().then(user =>
            {
                reviewData.map(review =>
                {
                    review.author = user._id;
                });

                Review.create(reviewData)
                .then((reviews) =>
                {
                    console.log("Reviews created");

                    var reviewIds = []
                    reviews.map(review =>
                    {
                        reviewIds.push(review._id);
                    });
                    academyData[0].reviews = reviewIds;

                    Academy.create(academyData)
                    .then(() =>
                    {
                        console.log("Academies created");

                        Academy.findOne()
                        .then(academy =>
                        {
                            // Seed courses
                            courseData.map(course =>
                            {
                                course.academy = academy._id;
                            });

                            Course.create(courseData)
                            .then(() =>
                            {
                                console.log("Courses created");
                            })
                            .catch(err =>
                            {
                                console.log("Courses NOT created");
                                console.log(err);
                            });
                        })
                        .catch(error =>
                        {
                            console.log("Courses NOT created");
                            console.log(error);
                        });
                    })
                    .catch(err =>
                    {
                        console.log("Academies NOT created");
                        console.log(err);
                    });
                })
                .catch(err =>
                {
                    console.log("Reviews NOT created");
                    console.log(err);
                });
            })
            .catch(err =>
            {
                console.log("Reviews NOT created");
                console.log(err);
            });
        })
        .catch(err =>
        {
            console.log("Users NOT created");
            console.log(err);
        });
    }
}
