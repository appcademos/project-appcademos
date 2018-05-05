const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    title: String,
    description: String,
    grade: {
      type: Number,
      min: 1,
      max: 5
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Review", reviewSchema);
