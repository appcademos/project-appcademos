const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
  {
    imagePath: String,
    imageName: String,
    description: String,
    website: String,
    name: {
      type: String,
      require: true
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
