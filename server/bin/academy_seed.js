require("dotenv").config();

const dbURL = process.env.DBURL;
const mongoose = require("mongoose");
const academyData = require("./academy_data");
const Academy = require("../api/academy/academy.model");

mongoose
  .connect(dbURL)
  .then(() => {
    Academy.collection.drop();

    Academy.create(academyData)
      .then(() => {
        console.log("academys created");
        mongoose.disconnect();
      })
      .catch(err => console.log(err));
  })
  .catch(err => {
    console.log("Error connecting to mongo", err);
  });
