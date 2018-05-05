const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    price: Number,
    title: String,
    level: String,
    minAge: Number,
    startDate: [Date],
    imagePath: String,
    imageName: String,
    sizeClass: Number,
    description: String,
    teacher: String,
    academy: {
      type: Schema.Types.ObjectId,
      ref: "Academy"
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Course", courseSchema);
