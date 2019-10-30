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
    group: [String],
    hours: Number,
    duration: String,
    about: [String], // TO BE DELETED
    requirements: [String], // TO BE DELETED
    weekclasses: Number,
    homework:[String], // TO BE DELETED
    startDate: Date,
    images: [
        {imagePath: String},
        {imageName: String}
    ],
    videoUrl: String,
    approvedRate: Number,
    sizeClass: Number,
    description: String,
    teacher: String, // TO BE DELETED
    tags: [String], // TO BE DELETED
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    reviews: [], // TO BE DELETED
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ], // TO BE DELETED
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
