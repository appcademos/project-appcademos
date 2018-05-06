const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    price: Number,
    title: {
      type: String,
      required: true
    },
    level: String,
    minAge: Number,
    startDate: [Date],
    imagePath: String,
    imageName: String,
    sizeClass: Number,
    description: String,
    teacher: String,
    tags: [String],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    academy: {
      type: Schema.Types.ObjectId,
      ref: "Academy"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Course", courseSchema);
