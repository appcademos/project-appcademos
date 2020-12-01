const _ = require("lodash")
const City = require("./city.model")
const Neighborhood = require("../neighborhood/neighborhood.model")
const debug = require("debug")("server:city.controller")

const getAll = async (req, res, next) =>
{
    try
    {
        let cities = await City.find().sort({name: 1})
        let citiesAndNeighborhoods = []
        for (let i = 0; i < cities.length; i++)
        {
            let city = cities[i]
            let neighborhoods = await Neighborhood.find({ city: city._id }).select('-city').sort({name: 1})
            citiesAndNeighborhoods.push({ ...city._doc, neighborhoods })
        }
        res.status(200).json(citiesAndNeighborhoods)
    }
    catch(err)
    {
        debug(err)
        res.status(400).json(err)
    }
}

const getOne = (req, res, next) =>
{
    City.findById(req.params.id).then(city =>
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
