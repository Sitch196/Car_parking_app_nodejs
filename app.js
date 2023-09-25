const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const userRouter = require("./routes/userRoutes");
const carRouter = require("./routes/carRoutes");
const parkingRouter = require("./routes/parkingzoneRoutes");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/parking", parkingRouter);

// handle all unhandeled routes
app.all("*", (req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

// global error handling middleware

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
