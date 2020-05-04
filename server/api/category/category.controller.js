require("dotenv").config();

const _ = require("lodash");
const Category = require("./category.model");
const debug = require("debug")("server:category.controller");
const fields = Object.keys(_.omit(Category.schema.paths, ["__v", "_id"]));
const Academy = require("../academy/academy.model");

const getAll = async (req, res, next) =>
{
    const categories = await Category.find({}).select("-__v -created_at -updated_at");
    
    if (categories != null)
        res.status(200).json(categories);
    else
        res.status(500).json({ message: "Error getting categories" });
};

const create = async (req, res, next) =>
{
    const properties = _.pick(req.body, fields);
    let newCategory = new Category(properties);

    try
    {
        let saveRes = await newCategory.save();
        
        let academyCategory = { category: newCategory }
        let updateRes = await Academy.updateMany({}, { $push: { categories: academyCategory } });

        if (updateRes != null && updateRes.ok)
            res.status(200).json({ message: "Category created" });
        else
            res.status(400).json({ message: "Category created but academies not updated" });
    }
    catch (err)
    {
        console.log(err);
        res.status(400).json(
        {
            message: "Something went wrong when trying to create the category",
            error: err
        });
    }
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
  create,
  update
};