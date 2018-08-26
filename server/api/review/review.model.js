const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    grade: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    author: {
      type:String,
      required: true
      // type: Schema.Types.ObjectId,
      // ref: "User"
    },
    // course: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Course",
    //   required: true
    // }
    academy: {
      type: Schema.Types.ObjectId,
      ref: "Academy",
      required: true
      
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
