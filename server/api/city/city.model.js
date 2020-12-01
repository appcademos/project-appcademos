const mongoose = require("mongoose")
const Schema = mongoose.Schema

const citySchema = new Schema(
{
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
)

module.exports = mongoose.model("City", citySchema)
