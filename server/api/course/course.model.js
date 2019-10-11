const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    price: Number,
    oldPrice: Number,
    title: {
      type: String,
      required: true
    },
    level: String,
    objetive: String,
    infocourse: String,
    exam: String,
    examresults: String,
    group: [String],
    hours: Number,
    duration: String,
    about: [String],
    requirements: [String],
    weekclasses: Number,
    foryouif: [String],
    howareclasses: [String],
    homework:[String],
    theme: [String],
    material: [String],
    startDate: Date,
    images: [{
      imagePath: String},
      {imageName: String
    }],
    videoUrl: String,
    approvedRate: Number,
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
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    impressions: {
        type: Number,
        default: 0
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Course", courseSchema);
