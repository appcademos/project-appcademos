const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
{
    title: {
      type: String,
      required: false
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
      required: false,
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    guestName: {
        type: String,
        required: false
    }
    // course: {
        //   type: Schema.Types.ObjectId,
        //   ref: "Course",
        //   required: true
        // }
        /*academy: {
          type: Schema.Types.ObjectId,
          ref: "Academy",
          required: true
      }*/
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Review", reviewSchema);
