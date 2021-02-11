var multer  = require('multer')
var upload = multer()
const axios = require('axios')
const NodeGeocoder = require('node-geocoder')
const Academy = require("../api/academy/academy.model")
const Neighborhood = require("../api/neighborhood/neighborhood.model")
const Category = require("../api/category/category.model")
const Course = require("../api/course/course.model")

module.exports = function(app)
{
    app.post('/automatic-academy-hook', upload.none(), async (req, res) =>
    {
        const options =
        {
            provider: 'google',
            apiKey: process.env.GOOGLE_API_KEY,
            language: 'es'
        }
        const geocoder = NodeGeocoder(options)
        
        console.log('\nAutomatic Academy Form Webhook:')
        //console.log('Body:', req.body)
        
        //let data = JSON.parse(req.body.rawRequest)
        let data = JSON.parse(unescapeJson(JSON.stringify(require('../bin/jotform_data.json'))))
        //console.log('Data:', data)
        let academyName = data.q2_nombreDe
        
        let academyExists = await Academy.findOne({ name: academyName })
        if (academyExists != null)
        {
            res.status(400).send({ message: 'Academy name already exists.' })
            return
        }
        
        let academyAddress = `${data.q77_dondeSe77.field_1} ${data.q77_dondeSe77.field_2}, ${data.q77_dondeSe77.field_4} ${data.q77_dondeSe77.field_3}`
        let mapsRes = await geocoder.geocode(`${academyAddress}, ${data.q77_dondeSe77.field_5}`)
        //console.log(mapsRes)
        let academyLocation = null
        if (mapsRes.length > 0 &&
            mapsRes[0].latitude != null &&
            mapsRes[0].longitude != null)
        {
            academyLocation = { coordinates: [mapsRes[0].latitude, mapsRes[0].longitude] }
        }
        
        let neighborhoods = []
        if (mapsRes.length > 0)
        {
            let foundNeighborhood = null
            if (mapsRes[0].neighborhood != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].neighborhood, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].extra != null && mapsRes[0].extra.neighborhood != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].locality, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].locality != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].locality, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].city != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].city, "$"].join(""), "i") })
            
            //console.log(foundNeighborhood)
            
            if (foundNeighborhood != null)
                neighborhoods.push(foundNeighborhood._id)
        }
        
        let whyChooseMe = null
        if (data.q59_queOs59 != null && data.q59_queOs59.length > 0)
        {
            whyChooseMe = "<ul>"
            data.q59_queOs59.forEach(line => whyChooseMe += `<li>${line}</li>`)
            whyChooseMe += "</ul>"
        }
        
        const allCategories = await Category.find({})
        let categories = null
        
        if (allCategories != null && allCategories.length > 0)
        {
            categories = []
            allCategories.forEach(category =>
            {
                categories.push({ category: category._id })
            })
        }
        
        let academy =
        {
            name: academyName,
            address: academyAddress,
            isVerified: true,
            location: academyLocation,
            neighborhoods: neighborhoods,
            whyChooseMe: whyChooseMe,
            categories: categories
        }
        console.log("\nACADEMY:\n", academy)
        
        let academyId = null
        try
        {
            let newAcademy = new Academy(academy)
            let createdAcademy = await newAcademy.save()
            academyId = createdAcademy._id
            
            sendSlackAcademyCreated(academy)
        }
        catch (err)
        {
            console.log(err) 
            res.status(400).json({ message: "Something went wrong when trying to create the academy", error: err })
        }
        
        
        // Courses
        let courseModality = data.q88_cualEs88[0].toLowerCase() == 'presencial' ?
                                'presencial' : 'online'
        let lastCourses = await Course.find().sort({ _id: -1 }).limit(1)
        let startDate = (lastCourses != null && lastCourses.length > 0) ?
                            lastCourses[0].startDate : null
        
        let course = null
        let courses = []
        for (let i = 0; i < data.q12_queTipos.length; i++)
        {
            let courseCat = data.q12_queTipos[i].toLowerCase()
            
            if (courseCat.indexOf("general (b1-c1)") > -1)
            {
                course = parseCourse(data, 'nivel B1', academyId, allCategories, startDate, courseModality)
                if (course != null) courses.push(course)
                console.log("\nCURSO B1\n", course)
                
                course = parseCourse(data, 'nivel B2', academyId, allCategories, startDate, courseModality)
                if (course != null) courses.push(course)
                console.log("\nCURSO B2\n", course)
                
                course = parseCourse(data, 'nivel C1', academyId, allCategories, startDate, courseModality)
                if (course != null) courses.push(course)
                console.log("\nCURSO C1\n", course)
            }
            
            if (courseCat.indexOf("exámenes") > -1)
            {
                let exams = data.q14_preparacionDe
                
                if (exams.includes("FCE"))
                {
                    course = parseCourse(data, 'First', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO FCE\n", course)
                }
                
                if (exams.includes("CAE"))
                {
                    course = parseCourse(data, 'Advanced', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO CAE\n", course)
                }
                
                if (exams.includes("TOEFL"))
                {
                    course = parseCourse(data, 'TOEFL', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO TOEFL\n", course)
                }
                
                if (exams.includes("TOEIC"))
                {
                    course = parseCourse(data, 'TOEIC', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO TOEIC\n", course)
                }
                
                if (exams.includes("IELTS"))
                {
                    course = parseCourse(data, 'IELTS', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO IELTS\n", course)
                }
                
                if (exams.includes("APTIS"))
                {
                    course = parseCourse(data, 'APTIS', academyId, allCategories, startDate, courseModality)
                    if (course != null) courses.push(course)
                    console.log("\nCURSO APTIS\n", course)
                }
            }
        }
        
        // Save courses
        for (let k = 0; k < courses.length; k++)
        {
            let course = courses[k]
            
            try
            {
                let newCourse = new Course(course)
                let createdCourse = await newCourse.save()
                
                if (createdCourse == null)
                {
                    // Error
                }
            }
            catch (err)
            {
                console.log(err) 
                //res.status(400).json({ message: "Something went wrong when trying to create the academy", error: err })
            }
        }
        
        res.status(200).send({ message: 'All ok' })
    })
    
    
    const unescapeJson = (x) =>
    {
        var r = /\\\\u([\d\w]{4})/gi
        x = x.replace(r, function (match, grp)
        {
            return String.fromCharCode(parseInt(grp, 16))
        })
        
        return x.replace(/\\\//g, '/')
    }
    const normalize = (str) => { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") }

    const getCategory = (allCategories, name) =>
    {
        return allCategories.find(category => category.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
    }
    const getGroupLetterDays = (daysArr) =>
    {
        let letterDays = ''
        for (let j = 0; j < daysArr.length; j++)
        {
            let day = daysArr[j].charAt(0)
            if (normalize(daysArr[j].toLowerCase()) === "miercoles")
                day = "X"
            
            let numDays = daysArr.length
            if (numDays === 1)
                letterDays = day
            else
            {
                if (j === numDays-1)        // Last day
                    letterDays += `y ${day}`
                else if (j === numDays-2)   // 1 before last day
                    letterDays += `${day} `
                else
                    letterDays += `${day}, `
            }
        }
        
        return letterDays
    }
    const parseCourse = (data, categoryName, academyId, allCategories, startDate, courseModality) =>
    {
        let coursePriceFieldName,
            groupFieldName,
            durationFieldName,
            classSizeFieldName,
            courseTitle
        
        if (categoryName === 'nivel B1' ||
            categoryName === 'nivel B2' ||
            categoryName === 'nivel C1')
        {
            coursePriceFieldName    = "q33_quePrecio33"
            classSizeFieldName      = "q40_cualEs40"
            
            if (categoryName === 'nivel B1')
            {
                groupFieldName      = "q37_queGrupos"
                durationFieldName   = "q85_comoEstructuras85"
            }
            else if (categoryName === 'nivel B2')
            {
                groupFieldName      = "q38_queGrupos38"
                durationFieldName   = "q86_comoEstructuras86"                
            }
            else if (categoryName === 'nivel C1')
            {
                groupFieldName      = "q39_queGrupos39"
                durationFieldName   = "q87_comoEstructuras87"
            }
            
            courseTitle = `Curso Inglés (${categoryName}) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
        }
        
        if (categoryName === 'First' ||
            categoryName === 'Advanced' ||
            categoryName === 'TOEFL' ||
            categoryName === 'TOEIC' ||
            categoryName === 'IELTS' ||
            categoryName === 'APTIS')
        {
            classSizeFieldName      = "q32_cualEs"
            coursePriceFieldName    = "q15_ltdivClassinlinequilleditgtque15"
            
            if (categoryName === 'First')
            {
                groupFieldName          = "q26_escribeLos"
                durationFieldName       = "q78_comoEstructuras"
                
                courseTitle = `Curso ${categoryName} (Nivel B2) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            }
            else if (categoryName === 'Advanced')
            {
                groupFieldName          = "q27_escribeLos27"
                durationFieldName       = "q79_comoEstructuras79"
                
                courseTitle = `Curso ${categoryName} (Nivel C1) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            }
            else if (categoryName === 'TOEFL')
            {
                coursePriceFieldName    = "q17_quePrecio17"
                groupFieldName          = "q29_escribeLos29"
                durationFieldName       = "q81_comoEstructuras81"
            }
            else if (categoryName === 'TOEIC')
            {
                coursePriceFieldName    = "q17_quePrecio17"
                groupFieldName          = "q30_escribeLos30"
                durationFieldName       = "q82_comoEstructuras82"
            }
            else if (categoryName === 'IELTS')
            {
                coursePriceFieldName    = "q18_quePrecio"
                groupFieldName          = "q31_escribeLos31"
                durationFieldName       = "q83_comoEstructuras83"
            }
            else if (categoryName === 'APTIS')
            {
                coursePriceFieldName    = "q90_quePrecio90"
                groupFieldName          = "q28_escribeLos28"
                durationFieldName       = "q80_comoEstructuras80"
            }
            
            if (categoryName != "First" && categoryName != "Advanced")
                courseTitle = `Curso ${categoryName} - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
        }
        
        let coursePrice = parseInt(data[coursePriceFieldName])
        let courseCategory = getCategory(allCategories, categoryName)
        let categoryId = (courseCategory != null) ? courseCategory._id : null
        let sizeClass = (data[classSizeFieldName] != null) ? parseInt(data[classSizeFieldName]) : null
        let imageUrl = (data.q61_tienesAlguna != null && data.q61_tienesAlguna.length > 0) ? [data.q61_tienesAlguna] : null
        
        let groupFields = data[groupFieldName]
        let groups = [ `Grupo 1: ${getGroupLetterDays(groupFields.field_1)} ${groupFields.field_2}` ]
        if (groupFields.field_3 != null && groupFields.field_3.length > 0)
            groups.push(`Grupo 2: ${getGroupLetterDays(groupFields.field_3)} ${groupFields.field_6}`)
        if (groupFields.field_4 != null && groupFields.field_4.length > 0)
            groups.push(`Grupo 3: ${getGroupLetterDays(groupFields.field_4)} ${groupFields.field_7}`)
        if (groupFields.field_5 != null && groupFields.field_5.length > 0)
            groups.push(`Grupo 4: ${getGroupLetterDays(groupFields.field_5)} ${groupFields.field_8}`)
        
        let course =
        {
            title: courseTitle,
            price: coursePrice,
            group: groups,
            hours: data[durationFieldName].field_2,
            duration: data[durationFieldName].field_1,
            weekclasses: data[durationFieldName].field_3,
            startDate: startDate,
            images: imageUrl,
            sizeClass: sizeClass,
            category: categoryId,
            modality: courseModality,
            academy: academyId
        }
        
        return course
    }
    
    const sendSlackAcademyCreated = async (academy) =>
    {
        // Send info to Slack
        /*let slackDataStr =
        `*Name*: ${academy.name}\n` +
        `*Teléfono*: ${newBooking.phone}\n` +
        `*Email*: ${newBooking.email}\n` +
        `*Grupo*: ${newBooking.group}\n` +
        `*Curso*: ${course.title} [${course._id}]\n` +
        `*Link*: https://www.yinius.es/cursos-ingles/curso/${course._id}\n` +
        `*Academia*: ${course.academy.name} - ${course.academy.address}\n` +
        `*Precio*: ${course.price}€`*/
        
        let slackDataStr = 'Nueva academia:\n'
        
        Object.keys(academy).forEach((key,index) =>
        {
            slackDataStr += `*${key}*: ${JSON.stringify(academy[key], undefined, 2)}\n`
        })
        
        try
        {
            let response = await axios.post(process.env.SLACK_WEBHOOK_URL,
            {
                text: `*Nuevo formulario*\n\n${slackDataStr}`
            },
            {
                headers: {'Content-type': 'application/json'}
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }
}