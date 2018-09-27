const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
  {
    phone: Number,
    imagePath: String,
    imageName: String,
    description: String,
    confirmationCode: String,
    address: String,
    about: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    name: {
      type: String
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
