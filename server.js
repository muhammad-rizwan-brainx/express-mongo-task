const express = require("express");
const mongoose = require('mongoose');
const core = require("cors");
const userRoutes = require('./api/routes/userRoutes');
const todoRoutes = require('./api/routes/taskRoutes');

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;
const db = mongoose.connect(mongoUri);
if (db) {
  console.log("success");
} else {
  console.log("DB not Connected");
}

const app = express();
app.use(express.json());
app.use('/user', userRoutes);
app.use('/tasks', todoRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port);
