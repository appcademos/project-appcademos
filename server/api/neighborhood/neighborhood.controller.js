const _ = require("lodash")
const Neighborhood = require("./neighborhood.model")
const debug = require("debug")("server:neighborhood.controller")

const getAll = (req, res, next) =>
{
    Neighborhood.find().then(cities =>
    {
        res.status(200).json(cities)
    })
    .catch(err =>
    {
        debug(err)
        res.status(400).json(err)
    })
}

const getOne = (req, res, next) =>
{
    Neighborhood.findById(req.params.id)
    .populate('city')
    .then(city =>
    {
        res.status(200).json(city)
    })
    .catch(err =>
    {
        debug(err)
        res.status(400).json(err)
    })
}

module.exports = { getAll, getOne }
