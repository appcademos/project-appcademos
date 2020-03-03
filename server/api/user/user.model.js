const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
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
    googleId: String
},
{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
});

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

module.exports = mongoose.model("User", userSchema);
