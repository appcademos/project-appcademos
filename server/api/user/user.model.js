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
    imageName: String,
    imagePath: String,
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
        type: String,
        default: "student"
    }
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
        admin: ['admin']
    }
});

module.exports = mongoose.model("User", userSchema);
