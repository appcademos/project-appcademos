require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const debug = require("debug")(`${path.basename(__dirname)}:app`);
const MongoStore = require("connect-mongo")(session);
const hashSecret = process.env.HASHCODE;
const dbURL = process.env.DBURL;
const cors = require("cors");
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const Category = require("./api/category/category.model");
const Academy = require("./api/academy/academy.model");
const User = require("./api/user/user.model");
const Course = require("./api/course/course.model");

mongoose.Promise = Promise;
mongoose
.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, setDefaultsOnInsert: true })
.then(() =>
{
    debug(`Connected to Mongo at ${dbURL}`);
    
    // Create Categories if none and academy categories
    createCategories();
    
    // Set student as users role
    setDefaultUserRoles();
    
    removeUnnecessaryUserFields();
    
    transferAcademyUsersToRealUsers();
    
    assignCoursesCategories();
})
.catch(err =>
{
    debug("Error connecting to mongo", err);
});

const app = express();

if (process.env.ENV != 'development')
    app.use(redirectToHTTPS(undefined, [/\/app/], 301));

var whitelist = [
  `${process.env.CORS_ALLOW}`,
  'http://localhost'
];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

// Middleware Setup
app.use(logger("dev"));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Enable authentication using session + passport
app.use(
  session({
    secret: hashSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    ttl: 48 * 60 * 60 // 2 days
  })
);
require("./config/passport")(app);

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.locals.title = "Appcademos";


// Pull master branch from github
app.post('/git-pull', function(req, res)
{
    console.log(req);

    // Verify checksum first
    const secret = process.env.GIT_PULL_SECRET;
    const headerChecksumKey = 'X-Hub-Signature';

    const payload = JSON.stringify(req.body);
    if (!payload)
    {
        res.status(400).send('Payload is empty.');
    }

    const hmac = crypto.createHmac('sha1', secret);
    const digest = 'sha1=' + hmac.update(payload).digest('hex');
    const checksum = req.headers[headerChecksumKey];
    if (!checksum || !digest || checksum !== digest)
    {
        res.status(401).send('Checksum verification failed.');
    }
    else // Checksum verified correctly
    {        
        const exec = require('child_process').exec;
        var yourscript = exec('sh git-pull.sh',
        (error, stdout, stderr) =>
        {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null)
                console.log(`exec error: ${error}`);
        });

        res.status(200).end();
    }
});

require("./routes/routes")(app);
app.use(function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


function createCategories()
{
    Category.countDocuments({}, function (err, count)
    {    
        if (count === 0)
        {
            Category
            .insertMany(
            [
                { name: 'First' },
                { name: 'Advanced' },
                { name: 'Proficiency' },
                { name: 'B1' },
                { name: 'B2' },
                { name: 'C1' },
                { name: 'TOEFL' },
                { name: 'TOEIC' },
                { name: 'IELTS' }
            ], function(err)
            {
                if (err)
                    debug(`Categories could not be created`);
                else
                {
                    debug(`Categories were created`);
                    
                    Category.find({}, function(err2, categories)
                    {
                        if (!err2)
                        {
                            Academy.find({}, function(err3, academies)
                            {
                                if (!err3)
                                {
                                    academies.forEach(function(academy)
                                    {
                                        if (academy.categories == null || academy.categories.length == 0)
                                        {
                                            academy.categories = []
                                            
                                            categories.forEach(function(category)
                                            {
                                                academy.categories.push({ category: category._id });
                                            });
                                            
                                            academy.save(function(err4)
                                            {
                                                if (err4)
                                                    debug(err4);
                                                else
                                                    debug(`Academy categories created for ${academy.name}`);
                                            });
                                        }
                                    });
                                }
                                else
                                    debug(`Error finding academies`);
                            });
                        }
                        else
                            debug(`Error finding ategories`);
                    });
                }
            });
        }
    });
}
function deleteCategories()
{
    debug('Removing categories');
    
    Academy.find({}, function(err, academies)
    {
        academies.forEach(function(academy)
        {
            academy.categories = null;
            academy.save(function(err2) { if (err2) debug(err2); });
        });
    });
    
    Category.remove({}, function(err){});
}
async function setDefaultUserRoles()
{
    await User.updateMany({role: null}, { $set: { role: 'student' } });
}
async function removeUnnecessaryUserFields()
{
    await User.updateMany({}, { $unset: { isAdmin: 1, payment: 1, canReview: 1, instauser: 1, preferences: 1 } }, { strict: false });
}
async function transferAcademyUsersToRealUsers()
{
    const academies = await Academy.find({ email: { $exists: 1 } });
    
    academies.forEach((academy) =>
    {
        const academyObject = academy.toObject();
        
        const newUserData =
        {
            email: academyObject.email,
            password: academyObject.password,
            name: "Academia",
            lastName: academyObject.name,
            role: "academy"
        }
        
        const academyUser = new User(newUserData);
        academyUser.save().then((user) =>
        {
            academy.user = user;
            academy.save();
        });
    });
    
    await Academy.updateMany({ email: { $exists: 1 } }, { $unset: { email: 1, password: 1 } }, { strict: false });
}
async function assignCoursesCategories()
{
    const courses = await Course.find({});
    const categories = await Category.find({});
    
    courses.forEach(async (course) => 
    {        
        if (course.tags != null && course.tags.length > 0)
        {
            let foundCategory = categories.find(category => category.name.toLowerCase() == course.tags[0].toLowerCase());
            
            if (foundCategory != null)
            {
                await Course.updateOne({ _id: course._id }, { category: foundCategory._id });
            }
        }
    });
    
    await Course.updateMany({ tags: { $exists: 1 } }, { $unset: { tags: 1 } }, { strict: false });
}


module.exports = app;
