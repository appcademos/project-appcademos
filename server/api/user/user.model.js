const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    phone: Number,
    birthDate: Date,
    imageName: String,
    imagePath: String,
    confirmationCode: String,
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    cart: [
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
