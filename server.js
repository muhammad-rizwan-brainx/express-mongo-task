const mongoose = require('mongoose');
const express = require("express");
const dotenv = require("dotenv");
const core = require("cors");
const DB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/taskRoutes');

dotenv.config();
const port = process.env.PORT;

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

DB.then(()=>{
  console.log("Database connected successfully");
  app.listen(port, console.log(`Server started on PORT:  ${port}`))
})
