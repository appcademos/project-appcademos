require("dotenv").config()

const path = require("path")
const mongoose = require("mongoose")
const dbURL = process.env.DBURL
const Academy = require("../api/academy/academy.model")
const Review = require("../api/review/review.model")

mongoose.Promise = Promise;
mongoose
.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, setDefaultsOnInsert: true })
.then(async () =>
{
    console.log(`Connected to Mongo at ${dbURL}\n`)
    
    try
    {
        let academies = await Academy.find({}).populate('reviews')
        for (let i = 0; i < academies.length; i++)
        {
            let averageRating = 0
            let academy = academies[i]
            
            if (academy != null && academy.reviews != null)
            {
                let numReviews = 0
                
                academy.reviews.forEach((review) =>
                {
                    if (review.grade == null)
                        return
                        
                    numReviews++
                    averageRating += review.grade
                })
                
                if (averageRating > 0)
                    averageRating = averageRating / numReviews
            }
            
            let res = await Academy.updateOne({ _id: academy._id }, { $set: { averageRating } })
            
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