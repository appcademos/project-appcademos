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
    weekclasses: Number,
    startDate: Date,
    images: [String],
    videoUrl: String,
    approvedRate: Number,
    sizeClass: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
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
