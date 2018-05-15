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
    group: [String],
    hours: Number,
    startDate: Date,
    image: [{
      imagePath: String,
      imageName: String
    }],
    successRate: Number,
    sizeClass: Number,
    description: String,
    teacher: String,
    tags: [String],
    reviews: [],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
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
