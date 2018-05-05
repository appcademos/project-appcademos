const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
  {
    email: {type: String, required: true},
    password: {type: String, required: true},
    imagePath: String,
    imageName: String,
    description: String,
    website: String,
    name: {
      type: String,
      required: true
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
