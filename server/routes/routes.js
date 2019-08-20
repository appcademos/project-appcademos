module.exports = app => {
  app.use("/api/academy", require("../api/academy/academy"));
  app.use("/api/course", require("../api/course/course"));
  app.use("/api/review", require("../api/review/review"));
  app.use("/api/user", require("../api/user/user"));
  app.use("/api/bookings", require("../api/booking/booking"));
};
