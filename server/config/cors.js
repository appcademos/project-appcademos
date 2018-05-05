require("dotenv").config();

module.exports = app => {
  const cors = require("cors");
  const allowedOrigins = process.env.CORS_ALLOW;
  let corsOptions = {
    origin: function(origin, isAllowed) {
      // Allow requests with no origin
      if (!origin) return isAllowed(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return isAllowed(new Error(msg), false);
      }
      return isAllowed(null, true);
    },
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
};
