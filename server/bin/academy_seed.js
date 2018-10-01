require("dotenv").config();

const academyData = require("./academy_data");
const Academy = require("../api/academy/academy.model");

module.exports =
{
    seedAcademies: function()
    {
        return new Promise((resolve, reject) =>
        {
            Academy.collection.drop();

            Academy.create(academyData)
            .then(() =>
            {
                console.log("Academies created");
                resolve();
            })
            .catch(err =>
            {
                console.log(err);
                reject();
            });
        });
    }
}
