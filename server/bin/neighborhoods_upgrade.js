require("dotenv").config()

const path = require("path")
const mongoose = require("mongoose")
const dbURL = process.env.DBURL
const Academy = require("../api/academy/academy.model")
const Neighborhood = require("../api/neighborhood/neighborhood.model")
const City = require("../api/city/city.model")

mongoose.Promise = Promise;
mongoose
.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, setDefaultsOnInsert: true })
.then(async () =>
{
    console.log(`Connected to Mongo at ${dbURL}\n`)
    
    try
    {
        let madridCity = await City.findOne({ name: 'Madrid' })
        let academies = await Academy.find({})
        for (let i = 0; i < academies.length; i++)
        {
            let academy = academies[i]
            let newNeighbIds = []
            
            if (academy.neighborhoodsOld == null)
            {
                console.log(`${academy.name} : No academy.neighborhoodsOld\n`)
                continue
            }
            
            for (let j = 0; j < academy.neighborhoodsOld.length; j++)
            {
                let n = academy.neighborhoodsOld[j]
                let newNeigh = (n === 'Centro') ?
                                await Neighborhood.findOne({ name: n, city: madridCity._id })
                                :
                                await Neighborhood.findOne({ name: n })
                
                if (newNeigh != null)
                {
                    console.log(newNeigh.name)
                    newNeighbIds.push(newNeigh._id)
                }
                else
                {
                    console.log(`newNeigh not found for name: ${n}`)
                }
            }
            
            let res = await Academy.updateOne({ _id: academy._id }, { $set: { neighborhoods: newNeighbIds } })
            
            console.log(`${JSON.stringify(res)}\n`)
        }
    }
    catch(err)
    {
        console.log(err)
    }
})
.catch(err =>
{
    console.log(err)
})