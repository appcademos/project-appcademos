const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
  {
    phone: Number,
    imagePath: String,
    imageName: String,
    description: String,
    confirmationCode: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    location: {
      type: { type: String },
      coordinates: [Number]
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Academy", academySchema);
