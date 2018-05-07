module.exports = app => {
  app.use("/academy", require("./academy"));
  app.use("/course", require("./course"));
  app.use("/review", require("./review"));
  app.use("/user", require("./user"));
  app.use("/", require("./home"));
  app.use(require("./badRequest")(app));
};
