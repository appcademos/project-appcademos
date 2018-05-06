module.exports = app => {
  app.use("/", require("./home"));
  app.use("/auth", require("./auth"));
  app.use("/review", require("./review"));
  app.use("/course", require("./course"));
  app.use("/academy", require("./academy"));
  app.use(require("./badRequest")(app));
};
