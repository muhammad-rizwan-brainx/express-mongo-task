const express = require("express");

const checkAuth = require("../middlewares/auth");
const taskController = require("../controllers/taskController");

const Router = express.Router();

Router.post("/", checkAuth, taskController.addTask);
Router.get("/", checkAuth, taskController.getAllTasks);
Router.get("/:taskID", checkAuth, taskController.getTask);
Router.patch("/:taskID", checkAuth, taskController.updateTask);
Router.delete("/:taskID", checkAuth, taskController.deleteTask);

module.exports = Router;
