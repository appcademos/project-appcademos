require("dotenv").config();
const cors = require("cors");

module.exports = app => {
  var whitelist = [
    `${process.env.CORS_ALLOW}`,
   ];
   var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
   };
   app.use(cors(corsOptions));
};
