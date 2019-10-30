const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academySchema = new Schema(
{
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    imagePath: String,
    imageName: String,
    description: String,
    address: String,
    about: [String], // TO BE DELETED
    whyChooseMe: String,
    images: [
        {imagePath: String},
        {imageName: String}
    ],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
    isVerified: {
      type: Boolean,
      default: false
    },
    name: String,
    location: {
      type: { type: String },
      coordinates: [Number]
    },
    district: String,
    city: String,
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
    ]
},
{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("Academy", academySchema);
