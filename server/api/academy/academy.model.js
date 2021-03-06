const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
{
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    address: { type: String, required: false, default: null },
    whyChooseMe: String,
    images: [
        {imagePath: String},
        {imageName: String}
    ],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
    isVerified: { type: Boolean, default: false },
    location: {
        type:
        {
            coordinates: { type: [Number], required: false }
        },
        required: false
    },
    averageRating: {
        type: Number,
        default: 0
    },
    categories: [
        {
            category: { type: Schema.Types.ObjectId, ref: "Category" },
            howAreTheClasses: { type: String, default: null },
            syllabus: { type: String, default: null },
            material: { type: String, default: null }
        }
    ],
    neighborhoodsOld: [{ type: String }],
    neighborhoods:
    {
        type:
        [
            {
                type: [Schema.Types.ObjectId],
                ref: "Neighborhood"
            }
        ],
        required: false
    }
},
{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("Academy", academySchema);
