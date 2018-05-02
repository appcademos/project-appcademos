const path = require("path");
const hbs = require("hbs");

module.exports = app => {
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");

  hbs.registerHelper("ifUndefined", (value, options) => {
    if (arguments.length < 2)
      throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
    if (typeof value !== undefined) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });
};
