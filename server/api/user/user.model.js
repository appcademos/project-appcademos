const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    phone: Number,
    imageUrl: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: false
    },
    role: {
        type: String,
        default: "student"
    },
    facebookId: String,
    googleId: String,
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Course"
    }],
},
{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
});

// User roles and access levels
userSchema.plugin(require('mongoose-role'),
{
    roles: ['student', 'academy', 'admin'],
    accessLevels:
    {
        student: ['student'],
        academy: ['academy'],
        admin: ['admin'],
        adminAndAcademy: ['admin', 'academy'],
        allRoles: ['admin', 'academy', 'student'],
    }
});

// Auto populate user favorites
var autoPopulateFavorites = function(next)
{
    this.populate(
        {
            path: 'favorites',
            populate:
            [
                {
                    path: 'academy',
                    populate:
                    {
                        path: 'reviews',
                        model: 'Review'
                    }
                },
                {
                    path: 'category'
                }
            ]
        })
    next()
}
userSchema.pre('findOne', autoPopulateFavorites).
           pre('find', autoPopulateFavorites)

module.exports = mongoose.model("User", userSchema);
