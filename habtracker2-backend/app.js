const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path"); //required for express static path for file accessing
//------------------Models---------------------------
const HttpError = require("./models/http-error");

//-------------------Instantiation---------------
const app = express();

//-------------------Routes-----------------------
const aprsRoutes = require("./routes/aprs-routes");
const gpsRoutes = require("./routes/gps-routes");
const habRoutes = require("./routes/hab-routes");
const trackerRoutes = require("./routes/tracker-routes");
const predictionRoutes = require("./routes/prediction-routes");
const smsRoutes = require("./routes/sms-routes");

//-----------------MiddleWare--------------------
app.use(bodyParser.json());

app.use(
  "/data/files/images",
  express.static(path.join("data", "files", "images"))
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Access-control-Allow-Origin required to let browser use api, the the * can be replaced by urls (for the browser) that are allowed to use it
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); //Second values are what types of requests you want to accept
  next();
});

//-----------------Known Routes--------------------------
app.use("/api/aprs", aprsRoutes); // /api/aprs...
app.use("/api/gps", userRoutes); // /api/gps...
app.use("/api/hab", todoRoutes); // /api/hab...
app.use("/api/tracker", trackerRoutes); // /api/tracker...
app.use("/api/prediction", predictionRoutes); // /api/tracker...
//allows for a different body parser for sms so you can read messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/sms", smsRoutes);

//-----------------Unknown Route Handling-------------------
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});


//------------------Mongo------------------------

mongoose
  .connect(
    `mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@${process.env.MongoDB_Server}/${process.env.MongoDB_DBName}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => {
    console.log(error);
  });
