const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
{
    name:
    {
        type: String,
        unique: false,
        required: true
    },
    phone:
    {
        type: String,
        unique: false,
        required: true
    },
    email:
    {
        type: String,
        unique: false,
        required: true
    },
    course:
    {
        type: Schema.Types.ObjectId,
        ref: "Course",
        unique: false,
        required: true
    },
    group:
    {
        type: String,
        unique: false,
        required: true
    },
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: false,
        required: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);
