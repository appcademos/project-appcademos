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
    let slackCoursesStr = ''
    let totalCoursesToCreate = 0
    let totalCoursesCreated = 0
    
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
        console.log('Body:', req.body)
        
        slackCoursesStr = ''
        totalCoursesToCreate = 0
        totalCoursesCreated = 0
        
        let data = JSON.parse(req.body.rawRequest)
        //let data = JSON.parse(unescapeJson(JSON.stringify(require('../bin/jotform_data.json'))))
        let submissionId = req.body.submissionID
        //console.log('Data:', data)
        let academyName = data.q2_nombreAcademia
        
        let academyExists = await Academy.findOne({ name: academyName })
        if (academyExists != null)
        {
            sendSlackAcademyNotCreated(submissionId, academyName, 'El nombre de la academia ya existe.')
            res.status(400).send({ message: 'Academy name already exists.' })
            return
        }
        
        let academyAddress = `${data.q77_dondeSe77.field_1} ${data.q77_dondeSe77.field_2}, ${data.q77_dondeSe77.field_4} ${data.q77_dondeSe77.field_3}`
        let mapsRes = await geocoder.geocode(`${academyAddress}, ${data.q77_dondeSe77.field_5}`)
        
        let academyLocation = null
        if (mapsRes.length > 0 &&
            mapsRes[0].latitude != null &&
            mapsRes[0].longitude != null)
        {
            academyLocation = { coordinates: [mapsRes[0].latitude, mapsRes[0].longitude] }
        }
        
        let neighborhoods = []
        let foundNeighborhood = null
        if (mapsRes.length > 0)
        {
            if (mapsRes[0].neighborhood != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].neighborhood, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].extra != null && mapsRes[0].extra.neighborhood != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].locality, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].locality != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].locality, "$"].join(""), "i") })
            if (foundNeighborhood == null && mapsRes[0].city != null)
                foundNeighborhood = await Neighborhood.findOne({ name: new RegExp(["^", mapsRes[0].city, "$"].join(""), "i") })
            
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
            
            sendSlackAcademyCreated(submissionId, academy, academyId, foundNeighborhood)
        }
        catch (err)
        {
            console.log(err) 
            res.status(400).json({ message: "Something went wrong when trying to create the academy", error: err })
            
            sendSlackAcademyNotCreated(submissionId, academyName, err)
        }
        
        
        // Courses
        let lastCourses = await Course.find().sort({ _id: -1 }).limit(1)
        let startDate = (lastCourses != null && lastCourses.length > 0) ?
                            lastCourses[0].startDate : null
        
        let catCourses = null
        let courses = []
        for (let i = 0; i < data.q94_preparacionDe.length; i++)
        {
            let courseCat = data.q94_preparacionDe[i]
            
            if (courseCat.includes("First Certificate"))
            {
                catCourses = parseCategory(data, 'First', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("Advanced English"))
            {
                catCourses = parseCategory(data, 'Advanced', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("Proficiency"))
            {
                catCourses = parseCategory(data, 'Proficiency', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("TOEFL"))
            {
                catCourses = parseCategory(data, 'TOEFL', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("TOEIC"))
            {
                catCourses = parseCategory(data, 'TOEIC', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("IELTS"))
            {
                catCourses = parseCategory(data, 'IELTS', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("APTIS General"))
            {
                catCourses = parseCategory(data, 'APTIS General', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            if (courseCat.includes("APTIS Advanced"))
            {
                catCourses = parseCategory(data, 'APTIS Advanced', academyId, allCategories, startDate)
                courses.push(...catCourses)
            }
            
            //console.log("\nCurso " + courseCat.toUpperCase() + "\n", catCourses)
        }
        
        for (let i = 0; i < data.q95_cursosDe.length; i++)
        {
            let courseCat = data.q95_cursosDe[i]
            let dbCat
            
            if (courseCat.includes("A1"))
                dbCat = 'nivel A1'
            else if (courseCat.includes("A2"))
                dbCat = 'nivel A2'
            else if (courseCat.includes("B1"))
                dbCat = 'nivel B1'
            else if (courseCat.includes("B2"))
                dbCat = 'nivel B2'
            else if (courseCat.includes("C1"))
                dbCat = 'nivel C1'
            else if (courseCat.includes("C2"))
                dbCat = 'nivel C2'
                
            catCourses = parseCategory(data, dbCat, academyId, allCategories, startDate)
            courses.push(...catCourses)
            
            //console.log("\nCurso " + courseCat.toUpperCase() + "\n", catCourses)
        }
        
        // Save courses
        totalCoursesToCreate = courses.length
        for (let k = 0; k < courses.length; k++)
        {
            let course = courses[k]
            let courseToCreate = {...course}
            delete courseToCreate.isKidsCourse
            delete courseToCreate.categoryName
            
            try
            {
                let newCourse = new Course(courseToCreate)
                let createdCourse = await newCourse.save()
                
                console.log(createdCourse)
                
                if (createdCourse == null)
                {
                    // Error
                    addSlackCourse(course, true)
                }
                else
                {
                    addSlackCourse(course, false)
                }
            }
            catch (err)
            {
                console.log(err)
                addSlackCourse(course, true, err)
            }
        }
        
        sendSlackCourses()
        
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
    const parseCategory = (data, categoryName, academyId, allCategories, startDate) =>
    {
        let courses = []
        let coursePriceFieldName, groupFieldName, durationFieldName, courseTitle, weekClassesFieldName,
            coursePriceFieldNameOnline, groupFieldNameOnline, durationFieldNameOnline, courseTitleOnline, weekClassesFieldNameOnline,
            
            coursePriceFieldNameKids, groupFieldNameKids, durationFieldNameKids, courseTitleKids, weekClassesFieldNameKids,
            coursePriceFieldNameKidsOnline, groupFieldNameKidsOnline, durationFieldNameKidsOnline, courseTitleKidsOnline, weekClassesFieldNameKidsOnline,
            
            hasOnlineCourse = false,
            hasPresencialCourse = false,
            
            hasKidsCourse = false,
            hasKidsOnlineCourse = false,
            hasKidsPresencialCourse = false
        
        
        if (categoryName === 'First')
        {
            // Online
            hasOnlineCourse = (normalize(data.q923_fceOnline).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q596_duracionDel596'
                groupFieldNameOnline        = 'q597_gruposAbiertos597'
                weekClassesFieldNameOnline  = 'q598_numeroDe598'
                coursePriceFieldNameOnline  = 'q599_precioDel599'
                
                courseTitleOnline           = `Curso ${categoryName} (Nivel B2) - ${data[durationFieldNameOnline].field_1} (${data[durationFieldNameOnline].field_2} horas)`
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q924_elCurso).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q601_duracionDel601'
                groupFieldName        = 'q602_gruposPresenciales602'
                weekClassesFieldName  = 'q603_numeroDe603'
                coursePriceFieldName  = 'q604_precioDel604'
                
                courseTitle           = `Curso ${categoryName} (Nivel B2) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q605_hacesCursos605).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q923_fceOnline).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q607_duracionDel607'
                    groupFieldNameKidsOnline        = 'q608_gruposDe'
                    weekClassesFieldNameKidsOnline  = 'q609_numeroDe609'
                    coursePriceFieldNameKidsOnline  = 'q610_precioMensual610'
                    
                    courseTitleKidsOnline           = `Curso ${categoryName} (Nivel B2) - ${data[durationFieldNameKidsOnline].field_1} (${data[durationFieldNameKidsOnline].field_2} horas)`
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q926_tusClases926).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q612_duracionDel612'
                    groupFieldNameKids        = 'q613_gruposPresenciales613'
                    weekClassesFieldNameKids  = 'q614_numeroDe614'
                    coursePriceFieldNameKids  = 'q615_precioMensual'
                    
                    courseTitleKids           = `Curso ${categoryName} (Nivel B2) - ${data[durationFieldNameKids].field_1} (${data[durationFieldNameKids].field_2} horas)`
                }
            }
        }
        if (categoryName === 'Advanced')
        {
            // Online
            hasOnlineCourse = (normalize(data.q927_elCurso644).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q645_duracionDel645'
                groupFieldNameOnline        = 'q646_gruposAbiertos646'
                weekClassesFieldNameOnline  = 'q647_numeroDe647'
                coursePriceFieldNameOnline  = 'q648_precioDel648'
                
                courseTitleOnline           = `Curso ${categoryName} (Nivel C1) - ${data[durationFieldNameOnline].field_1} (${data[durationFieldNameOnline].field_2} horas)`
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q928_elCurso649).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q650_duracionDel650'
                groupFieldName        = 'q651_gruposPresenciales651'
                weekClassesFieldName  = 'q652_numeroDe652'
                coursePriceFieldName  = 'q653_precioDel653'
                
                courseTitle           = `Curso ${categoryName} (Nivel C1) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            }
        }
        if (categoryName === 'Proficiency')
        {
            // Online
            hasOnlineCourse = (normalize(data.q929_elCurso929).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q666_duracionDel666'
                groupFieldNameOnline        = 'q667_gruposAbiertos'
                weekClassesFieldNameOnline  = 'q668_numeroDe668'
                coursePriceFieldNameOnline  = 'q669_precioDel'
                
                courseTitleOnline           = `Curso ${categoryName} (Nivel C2) - ${data[durationFieldNameOnline].field_1} (${data[durationFieldNameOnline].field_2} horas)`
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q930_elCurso930).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q671_duracionDel671'
                groupFieldName        = 'q672_gruposPresenciales672'
                weekClassesFieldName  = 'q673_numeroDe673'
                coursePriceFieldName  = 'q674_precioDel674'
                
                courseTitle           = `Curso ${categoryName} (Nivel C2) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            }
        }
        if (categoryName === 'APTIS General')
        {
            // Online
            hasOnlineCourse = (normalize(data.q931_elCurso931).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q687_duracionDel687'
                groupFieldNameOnline        = 'q688_gruposAbiertos688'
                weekClassesFieldNameOnline  = 'q689_numeroDe689'
                coursePriceFieldNameOnline  = 'q690_precioDel690'
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q932_elCurso932).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q692_duracionDel692'
                groupFieldName        = 'q693_gruposPresenciales693'
                weekClassesFieldName  = 'q694_numeroDe694'
                coursePriceFieldName  = 'q695_precioDel695'                
            }
        }
        if (categoryName === 'APTIS Advanced')
        {
            // Online
            hasOnlineCourse = (normalize(data.q933_elCurso933).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q708_duracionDel708'
                groupFieldNameOnline        = 'q709_gruposAbiertos709'
                weekClassesFieldNameOnline  = 'q710_numeroDe710'
                coursePriceFieldNameOnline  = 'q711_precioDel711'
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q934_elCurso934).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q713_duracionDel713'
                groupFieldName        = 'q714_gruposPresenciales714'
                weekClassesFieldName  = 'q715_numeroDe715'
                coursePriceFieldName  = 'q716_precioDel716'                
            }
        }
        if (categoryName === 'TOEIC')
        {
            // Online
            hasOnlineCourse = (normalize(data.q935_elCurso935).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q729_duracionDel'
                groupFieldNameOnline        = 'q730_gruposAbiertos730'
                weekClassesFieldNameOnline  = 'q731_numeroDe731'
                coursePriceFieldNameOnline  = 'q732_precioDel732'
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q936_elCurso936).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q734_duracionDel734'
                groupFieldName        = 'q735_gruposPresenciales'
                weekClassesFieldName  = 'q736_numeroDe'
                coursePriceFieldName  = 'q737_precioDel737'                
            }
        }
        if (categoryName === 'TOEFL')
        {
            // Online
            hasOnlineCourse = (normalize(data.q937_elCurso937).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q750_duracionDel750'
                groupFieldNameOnline        = 'q751_gruposAbiertos751'
                weekClassesFieldNameOnline  = 'q752_numeroDe752'
                coursePriceFieldNameOnline  = 'q753_precioDel753'
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q938_elCurso938).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q755_duracionDel755'
                groupFieldName        = 'q756_gruposPresenciales756'
                weekClassesFieldName  = 'q757_numeroDe757'
                coursePriceFieldName  = 'q758_precioDel758'                
            }
        }
        if (categoryName === 'IELTS')
        {
            // Online
            hasOnlineCourse = (normalize(data.q939_elCurso939).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q771_duracionDel771'
                groupFieldNameOnline        = 'q772_gruposAbiertos772'
                weekClassesFieldNameOnline  = 'q773_numeroDe773'
                coursePriceFieldNameOnline  = 'q774_precioDel774'
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q940_elCurso940).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q776_duracionDel776'
                groupFieldName        = 'q777_gruposPresenciales777'
                weekClassesFieldName  = 'q778_numeroDe778'
                coursePriceFieldName  = 'q779_precioDel779'                
            }
        }
        
        
        if (categoryName === 'nivel A1')
        {
            // Online
            hasOnlineCourse = (normalize(data.q941_elCurso941).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q793_duracionDel793'
                groupFieldNameOnline        = 'q794_gruposAbiertos794'
                weekClassesFieldNameOnline  = 'q795_numeroDe795'
                coursePriceFieldNameOnline  = 'q796_precioDel796'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q942_elCurso942).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q798_duracionDel798'
                groupFieldName        = 'q799_gruposPresenciales799'
                weekClassesFieldName  = 'q800_numeroDe800'
                coursePriceFieldName  = 'q801_precioDel801'                
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q802_hacesCursos).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q943_tienesClases943).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q804_duracionDel804'
                    groupFieldNameKidsOnline        = 'q805_gruposVirtuales'
                    weekClassesFieldNameKidsOnline  = 'q806_numeroDe806'
                    coursePriceFieldNameKidsOnline  = 'q807_precioMensual807'                    
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q944_tusClases).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q809_duracionDel809'
                    groupFieldNameKids        = 'q810_gruposPresenciales810'
                    weekClassesFieldNameKids  = 'q811_numeroDe811'
                    coursePriceFieldNameKids  = 'q812_precioMensual812'                    
                }
            }
        }
        if (categoryName === 'nivel A2')
        {
            // Online
            hasOnlineCourse = (normalize(data.q945_elCurso945).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q815_duracionDel815'
                groupFieldNameOnline        = 'q816_gruposAbiertos816'
                weekClassesFieldNameOnline  = 'q817_numeroDe817'
                coursePriceFieldNameOnline  = 'q818_precioDel818'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q946_elCurso946).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q820_duracionDel820'
                groupFieldName        = 'q821_gruposPresenciales821'
                weekClassesFieldName  = 'q822_numeroDe822'
                coursePriceFieldName  = 'q823_precioDel823'                
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q824_hacesCursos824).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q947_tienesClases947).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q826_duracionDel826'
                    groupFieldNameKidsOnline        = 'q827_gruposVirtuales827'
                    weekClassesFieldNameKidsOnline  = 'q828_numeroDe828'
                    coursePriceFieldNameKidsOnline  = 'q829_precioMensual829'                    
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q948_tusClases948).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q831_duracionDel831'
                    groupFieldNameKids        = 'q832_gruposPresenciales832'
                    weekClassesFieldNameKids  = 'q833_numeroDe833'
                    coursePriceFieldNameKids  = 'q834_precioMensual834'                    
                }
            }
        }
        if (categoryName === 'nivel B1')
        {
            // Online
            hasOnlineCourse = (normalize(data.q949_elCurso949).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q837_duracionDel837'
                groupFieldNameOnline        = 'q838_gruposAbiertos838'
                weekClassesFieldNameOnline  = 'q839_numeroDe839'
                coursePriceFieldNameOnline  = 'q840_precioDel840'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q950_elCurso950).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q842_duracionDel842'
                groupFieldName        = 'q843_gruposPresenciales843'
                weekClassesFieldName  = 'q844_numeroDe844'
                coursePriceFieldName  = 'q845_precioDel845'                
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q846_hacesCursos846).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q951_tienesClases951).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q848_duracionDel848'
                    groupFieldNameKidsOnline        = 'q849_gruposPresenciales849'
                    weekClassesFieldNameKidsOnline  = 'q850_numeroDe850'
                    coursePriceFieldNameKidsOnline  = 'q851_precioMensual851'                    
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q952_tusClases952).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q853_duracionDel853'
                    groupFieldNameKids        = 'q854_gruposPresenciales854'
                    weekClassesFieldNameKids  = 'q855_numeroDe855'
                    coursePriceFieldNameKids  = 'q856_precioMensual856'                    
                }
            }
        }
        if (categoryName === 'nivel B2')
        {
            // Online
            hasOnlineCourse = (normalize(data.q953_elCurso953).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q859_duracionDel859'
                groupFieldNameOnline        = 'q860_gruposAbiertos860'
                weekClassesFieldNameOnline  = 'q861_numeroDe861'
                coursePriceFieldNameOnline  = 'q862_precioDel862'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q955_elCurso955).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q864_duracionDel864'
                groupFieldName        = 'q865_gruposPresenciales865'
                weekClassesFieldName  = 'q866_numeroDe866'
                coursePriceFieldName  = 'q867_precioDel867'                
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q868_hacesCursos868).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q956_tienesClases).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q870_duracionDel870'
                    groupFieldNameKidsOnline        = 'q871_gruposVirtuales871'
                    weekClassesFieldNameKidsOnline  = 'q872_numeroDe872'
                    coursePriceFieldNameKidsOnline  = 'q873_precioMensual873'                    
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q957_tusClases957).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q875_duracionDel875'
                    groupFieldNameKids        = 'q876_gruposPresenciales876'
                    weekClassesFieldNameKids  = 'q877_numeroDe877'
                    coursePriceFieldNameKids  = 'q878_precioMensual878'                    
                }
            }
        }
        if (categoryName === 'nivel C1')
        {
            // Online
            hasOnlineCourse = (normalize(data.q958_elCurso958).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q881_duracionDel881'
                groupFieldNameOnline        = 'q882_gruposAbiertos882'
                weekClassesFieldNameOnline  = 'q883_numeroDe883'
                coursePriceFieldNameOnline  = 'q884_precioDel884'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q959_elCurso959).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q886_duracionDel886'
                groupFieldName        = 'q887_gruposPresenciales887'
                weekClassesFieldName  = 'q888_numeroDe888'
                coursePriceFieldName  = 'q889_precioDel889'                
            }
            
            // Kids
            hasKidsCourse = (normalize(data.q890_hacesCursos890).toLowerCase() == 'si')
            if (hasKidsCourse)
            {
                // Online
                hasKidsOnlineCourse = (normalize(data.q960_tienesClases960).toLowerCase() == 'si')
                if (hasKidsOnlineCourse)
                {
                    durationFieldNameKidsOnline     = 'q892_duracionDel892'
                    groupFieldNameKidsOnline        = 'q893_gruposVirtuales893'
                    weekClassesFieldNameKidsOnline  = 'q894_numeroDe894'
                    coursePriceFieldNameKidsOnline  = 'q895_precioMensual895'                    
                }
                
                // Presencial
                hasKidsPresencialCourse = !hasKidsOnlineCourse || (normalize(data.q961_tusClases961).toLowerCase() == 'si')
                if (hasKidsPresencialCourse)
                {
                    durationFieldNameKids     = 'q897_duracionDel897'
                    groupFieldNameKids        = 'q898_gruposPresenciales898'
                    weekClassesFieldNameKids  = 'q899_numeroDe899'
                    coursePriceFieldNameKids  = 'q900_precioMensual900'                    
                }
            }
        }
        if (categoryName === 'nivel C2')
        {
            // Online
            hasOnlineCourse = (normalize(data.q962_elCurso962).toLowerCase() == 'si')
            if (hasOnlineCourse)
            {
                durationFieldNameOnline     = 'q903_duracionDel903'
                groupFieldNameOnline        = 'q904_gruposAbiertos904'
                weekClassesFieldNameOnline  = 'q905_numeroDe905'
                coursePriceFieldNameOnline  = 'q906_precioDel906'                
            }
            
            // Presencial
            hasPresencialCourse = !hasOnlineCourse || (normalize(data.q964_elCurso964).toLowerCase() == 'si')
            if (hasPresencialCourse)
            {
                durationFieldName     = 'q908_duracionDel908'
                groupFieldName        = 'q909_gruposPresenciales909'
                weekClassesFieldName  = 'q910_numeroDe910'
                coursePriceFieldName  = 'q911_precioDel911'                
            }
        }
        
        
        if (categoryName != "First" && categoryName != "Advanced" && categoryName != "Proficiency")
        {
            if (hasPresencialCourse)
                courseTitle = `Curso ${categoryName} - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            
            if (hasOnlineCourse)
                courseTitleOnline = `Curso ${categoryName} - ${data[durationFieldNameOnline].field_1} (${data[durationFieldNameOnline].field_2} horas)`
                
            if (hasKidsCourse)
            {
                courseTitleKids       = `Curso ${categoryName} - ${data[durationFieldNameKids].field_1} (${data[durationFieldNameKids].field_2} horas)`
                courseTitleKidsOnline = `Curso ${categoryName} - ${data[durationFieldNameKidsOnline].field_1} (${data[durationFieldNameKidsOnline].field_2} horas)`
            }
        }
        
        if (['nivel A1', 'nivel A2', 'nivel B1', 'nivel B2', 'nivel C1', 'nivel C2'].includes(categoryName))
        {
            if (hasPresencialCourse)
                courseTitle = `Curso Inglés (${categoryName.replace('nivel', 'Nivel')}) - ${data[durationFieldName].field_1} (${data[durationFieldName].field_2} horas)`
            
            if (hasOnlineCourse)
                courseTitleOnline = `Curso Inglés (${categoryName.replace('nivel', 'Nivel')}) - ${data[durationFieldNameOnline].field_1} (${data[durationFieldNameOnline].field_2} horas)`
                
            if (hasKidsCourse)
            {
                courseTitleKids       = `Curso Inglés (${categoryName.replace('nivel', 'Nivel')}) - ${data[durationFieldNameKids].field_1} (${data[durationFieldNameKids].field_2} horas)`
                courseTitleKidsOnline = `Curso Inglés (${categoryName.replace('nivel', 'Nivel')}) - ${data[durationFieldNameKidsOnline].field_1} (${data[durationFieldNameKidsOnline].field_2} horas)`
            }
        }
        
        
        let courseCategory = getCategory(allCategories, categoryName)
        let categoryId = (courseCategory != null) ? courseCategory._id : null
        //let sizeClass = (data[classSizeFieldName] != null) ? parseInt(data[classSizeFieldName]) : null
        let imageUrl = (data.q61_paraTerminar != null && data.q61_paraTerminar.length > 0) ? [data.q61_paraTerminar] : null
        
        // Presencial
        if (hasPresencialCourse)
        {
            let coursePrice = parseInt(data[coursePriceFieldName])
            
            let groupFields = data[groupFieldName]
            let groups = [ `Grupo 1: ${getGroupLetterDays(groupFields.field_9)} ${groupFields.field_2}` ]
            if (groupFields.field_10 != null && groupFields.field_10.length > 0)
                groups.push(`Grupo 2: ${getGroupLetterDays(groupFields.field_10)} ${groupFields.field_4}`)
            if (groupFields.field_11 != null && groupFields.field_11.length > 0)
                groups.push(`Grupo 3: ${getGroupLetterDays(groupFields.field_11)} ${groupFields.field_6}`)
            if (groupFields.field_12 != null && groupFields.field_12.length > 0)
                groups.push(`Grupo 4: ${getGroupLetterDays(groupFields.field_12)} ${groupFields.field_8}`)
            
            let course =
            {
                title: courseTitle,
                price: coursePrice,
                group: groups,
                hours: data[durationFieldName].field_2,
                duration: data[durationFieldName].field_1,
                weekclasses: data[weekClassesFieldName],
                startDate: startDate,
                images: imageUrl,
                //sizeClass: sizeClass,
                category: categoryId,
                modality: 'presencial',
                academy: academyId,
                categoryName: categoryName
            }
            courses.push(course)
        }
        
        // Online
        if (hasOnlineCourse)
        {
            let coursePriceOnline = parseInt(data[coursePriceFieldNameOnline])
            
            let groupFieldsOnline = data[groupFieldNameOnline]
            let groupsOnline = [ `Grupo 1: ${getGroupLetterDays(groupFieldsOnline.field_9)} ${groupFieldsOnline.field_2}` ]
            if (groupFieldsOnline.field_10 != null && groupFieldsOnline.field_10.length > 0)
                groupsOnline.push(`Grupo 2: ${getGroupLetterDays(groupFieldsOnline.field_10)} ${groupFieldsOnline.field_4}`)
            if (groupFieldsOnline.field_11 != null && groupFieldsOnline.field_11.length > 0)
                groupsOnline.push(`Grupo 3: ${getGroupLetterDays(groupFieldsOnline.field_11)} ${groupFieldsOnline.field_6}`)
            if (groupFieldsOnline.field_12 != null && groupFieldsOnline.field_12.length > 0)
                groupsOnline.push(`Grupo 4: ${getGroupLetterDays(groupFieldsOnline.field_12)} ${groupFieldsOnline.field_8}`)
                
            let course =
            {
                title: courseTitleOnline,
                price: coursePriceOnline,
                group: groupsOnline,
                hours: data[durationFieldNameOnline].field_2,
                duration: data[durationFieldNameOnline].field_1,
                weekclasses: data[weekClassesFieldNameOnline],
                startDate: startDate,
                images: imageUrl,
                category: categoryId,
                modality: 'online',
                academy: academyId,
                categoryName: categoryName
            }
            courses.push(course)
        }
        
        // Kids
        if (hasKidsCourse)
        {
            courseCategory = getCategory(allCategories, 'Niños')
            categoryId = (courseCategory != null) ? courseCategory._id : null
            
            // Presencial
            if (hasKidsPresencialCourse)
            {
                let coursePriceKids = parseInt(data[coursePriceFieldNameKids])
                
                let groupFields = data[groupFieldNameKids]
                let groups = [ `Grupo 1: ${getGroupLetterDays(groupFields.field_9)} ${groupFields.field_2}` ]
                if (groupFields.field_10 != null && groupFields.field_10.length > 0)
                    groups.push(`Grupo 2: ${getGroupLetterDays(groupFields.field_10)} ${groupFields.field_4}`)
                if (groupFields.field_11 != null && groupFields.field_11.length > 0)
                    groups.push(`Grupo 3: ${getGroupLetterDays(groupFields.field_11)} ${groupFields.field_6}`)
                if (groupFields.field_12 != null && groupFields.field_12.length > 0)
                    groups.push(`Grupo 4: ${getGroupLetterDays(groupFields.field_12)} ${groupFields.field_8}`)
                
                let course =
                {
                    title: courseTitleKids,
                    price: coursePriceKids,
                    group: groups,
                    hours: data[durationFieldNameKids].field_2,
                    duration: data[durationFieldNameKids].field_1,
                    weekclasses: data[weekClassesFieldNameKids],
                    startDate: startDate,
                    images: imageUrl,
                    //sizeClass: sizeClass,
                    category: categoryId,
                    modality: 'presencial',
                    academy: academyId,
                    isKidsCourse: true,
                    categoryName: categoryName
                }
                courses.push(course)
            }
            
            // Online
            if (hasKidsOnlineCourse)
            {
                let coursePriceKidsOnline = parseInt(data[coursePriceFieldNameKidsOnline])
                
                let groupFieldsOnline = data[groupFieldNameKidsOnline]
                let groupsOnline = [ `Grupo 1: ${getGroupLetterDays(groupFieldsOnline.field_9)} ${groupFieldsOnline.field_2}` ]
                if (groupFieldsOnline.field_10 != null && groupFieldsOnline.field_10.length > 0)
                    groupsOnline.push(`Grupo 2: ${getGroupLetterDays(groupFieldsOnline.field_10)} ${groupFieldsOnline.field_4}`)
                if (groupFieldsOnline.field_11 != null && groupFieldsOnline.field_11.length > 0)
                    groupsOnline.push(`Grupo 3: ${getGroupLetterDays(groupFieldsOnline.field_11)} ${groupFieldsOnline.field_6}`)
                if (groupFieldsOnline.field_12 != null && groupFieldsOnline.field_12.length > 0)
                    groupsOnline.push(`Grupo 4: ${getGroupLetterDays(groupFieldsOnline.field_12)} ${groupFieldsOnline.field_8}`)
                    
                let course =
                {
                    title: courseTitleKidsOnline,
                    price: coursePriceKidsOnline,
                    group: groupsOnline,
                    hours: data[durationFieldNameKidsOnline].field_2,
                    duration: data[durationFieldNameKidsOnline].field_1,
                    weekclasses: data[weekClassesFieldNameKidsOnline],
                    startDate: startDate,
                    images: imageUrl,
                    category: categoryId,
                    modality: 'online',
                    academy: academyId,
                    isKidsCourse: true,
                    categoryName: categoryName
                }
                courses.push(course)
            }
        }     
        
        return courses
    }
    
    const sendSlackAcademyCreated = async (submissionId, academy, academyId, foundNeighborhood) =>
    {
        let allOk = true
        let slackDataStr =
        `🎓 *Nueva academia integrada*:\n\n` +
        `*Nombre*: ${academy.name}\n` +
        `*Link manager*: https://www.yinius.es/manager/academy/${academyId}\n` +
        `*Link editar form*: https://eu.jotform.com/edit/${submissionId}\n`
        
        if (academy.location == null ||
            academy.location.coordinates == null ||
            academy.location.coordinates.length != 2)
        {
            // Error with maps location/coordinates
            slackDataStr += `❌ No tiene *coordenadas*\n`
            allOk = false
        }
        else
            slackDataStr += `*Coordenadas*: [${academy.location.coordinates[0]},${academy.location.coordinates[1]}] https://www.google.com/maps/search/?api=1&query=${academy.location.coordinates[0]},${academy.location.coordinates[1]}\n`
        
        if (academy.neighborhoods == null ||
            academy.neighborhoods.length == 0)
        {
            // Error with neighborhoods
            slackDataStr += `❌ No tiene *barrio/s*\n`
            allOk = false
        }
        else if (foundNeighborhood != null && foundNeighborhood.name != null)
            slackDataStr += `*Barrio*: ${foundNeighborhood.name}\n`
        
        if (academy.whyChooseMe == null ||
            academy.whyChooseMe.trim().length == 0)
        {
            // Error with whyChooseMe
            slackDataStr += `❌ No tiene *whyChooseMe*\n`
            allOk = false
        }
        
        if (allOk)
            slackDataStr += `✅ Academia creada correctamente\n`
        
        try
        {
            let response = await axios.post(process.env.SLACK_WEBHOOK_URL,
            {
                text: slackDataStr
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
    const sendSlackAcademyNotCreated = async (submissionId, academyName, err) =>
    {
        let slackDataStr =
        `❌ No se ha podido crear la academia '${academyName}'\n` +
        `Se ha de reintentar el envío del form en Jotform:\n` +
        `https://eu.jotform.com/edit/${submissionId}`
        
        if (err != null)
            slackDataStr += `\n${err}`
        
        try
        {
            let response = await axios.post(process.env.SLACK_WEBHOOK_URL,
            {
                text: slackDataStr
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
    
    const addSlackCourse = (course, hasError, error) =>
    {
        if (!hasError) totalCoursesCreated++
        slackCoursesStr += (error != null && hasError) ?
                            ((course.isKidsCourse) ?
                            `❌ ${course.categoryName} Niños ${course.modality}${(error != null) ? ' - '+error : ''}\n` :
                            `❌ ${course.categoryName} ${course.modality}${(error != null) ? ' - '+error : ''}\n`)
                            :
                            ((course.isKidsCourse) ?
                            `✅ ${course.categoryName} Niños ${course.modality}\n` :
                            `✅ ${course.categoryName} ${course.modality}\n`)
    }
    const sendSlackCourses = async () =>
    {        
        try
        {
            let response = await axios.post(process.env.SLACK_WEBHOOK_URL,
            {
                text: `*Resultado cursos*:\n${totalCoursesCreated}/${totalCoursesToCreate} cursos creados:\n${slackCoursesStr}`
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
    
    
    const deleteAcademy = async (academyId) =>
    {
        await Course.deleteMany({ academy: academyId })
        await Academy.deleteOne({ _id: academyId })
    }
    const deleteJotformAcademy = () =>
    {
        return new Promise(async (resolve, reject) =>
        {
            let res = await Academy.find({name: "Jotform Test"})
            let academy = (res != null && res.length > 0) ? res[0] : null
            
            if (academy == null)
                reject()
            else
            {    
                await Course.deleteMany({ academy: academy._id })
                await Academy.deleteOne({ _id: academy._id })
                
                resolve()
            }
        })
    }
}