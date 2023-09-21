const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/mongo");
const app = express();

const PORT = process.env.PORT || 5500;

// connerct to database
connectDB();

// middleware
app.use(morgan("common"));
app.use(express.json());

// user defined routes
app.use("/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/location", require("./routes/location"));


// app.use("/", (req, res) => {
//   res.status(200).json({ message: "API for chiziviso" });
// });

//not found handler
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

//error handling middleware
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(error);
  res.send({
    message: error.message,
    stack:
      process.env.NODE_ENV === "production"
        ? "you are in production"
        : error.stack,
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR - ${err}`);
  }
  console.log(`Server up on port ${PORT}`);
});
