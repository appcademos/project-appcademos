module.exports = app => {
  app.use("/api/academy", require("./academy"));
  app.use("/api/course", require("./course"));
  app.use("/api/review", require("./review"));
  app.use("/api/user", require("./user"));
  app.use("/", require("./home"));

};
