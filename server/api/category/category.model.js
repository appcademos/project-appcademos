const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
{
    name:           { type: String, required: true },
    fullName:       { type: String, required: true },
    forYouIf:       { type: String, default: null },
    coursesInfo:    { type: String, default: null },
},
{
    timestamps:
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("Category", categorySchema);
