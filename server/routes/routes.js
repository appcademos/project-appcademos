module.exports = app => {
  app.use("/", require("./home"));
  app.use("/auth", require("./auth"));
};
