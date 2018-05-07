const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    phone: Number,
    birthdate: Date,
    imageName: String,
    imagePath: String,
    payment: {
      type: Boolean,
      default: false
    },
    willAttend: {
      type: Boolean,
      default: false
    },
    persist: {
      type: Boolean,
      default: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
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

module.exports = mongoose.model("User", userSchema);
