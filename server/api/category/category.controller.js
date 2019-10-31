require("dotenv").config();

const Category = require("./category.model");
const debug = require("debug")("server:category.controller");

const getAll = async (req, res, next) =>
{
    const categories = await Category.find({}).select("-__v -created_at -updated_at");
    
    if (categories != null)
        res.status(200).json(categories);
    else
        res.status(500).json({ message: "Error getting categories" });
};

const update = async (req, res, next) =>
{    
    const result = await Category.updateOne({ _id: req.params.id }, req.body);
    
    if (result != null && result.nModified == 1 && result.ok == 1)
        res.status(200).json({ updated: true });
    else
        res.status(400).json({ message: "Error updating category" });
};


module.exports = {
  getAll,
  update
};