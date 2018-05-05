const app = require("express")();
const cors = require("./config/cors")(app);

// Default value for title local
app.locals.title = "Appcademos";

require("./config/hbs")(app);
require("./config/express")(app);
require("./config/passport")(app);
require("./routes/routes")(app);

module.exports = app;
