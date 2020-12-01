const mongoose = require("mongoose")
const Schema = mongoose.Schema

const neighborhoodSchema = new Schema(
{
    name: {
      type: String,
      required: true,
      unique: false
    },
    city: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "City",
      unique: false
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
)

neighborhoodSchema.index({ name: 1, city: 1 }, { unique: true })

module.exports = mongoose.model("Neighborhood", neighborhoodSchema)
