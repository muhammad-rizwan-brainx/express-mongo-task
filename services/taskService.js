const mongoose = require("mongoose");
const Task = require("../models/taskModel");

const validateTaskFields = (title, description) => {
  if (!title || !description) {
    return false;
  }
  return true;
};

exports.getAllTasks = () => {
  return new Promise((resolve, reject) => {
    Task.find()
      .select("title description")
      .then((result) => resolve(result))
      .catch((err) => reject("couldn't get tasks"));
  });
};

exports.addTask = (title, description) => {
  return new Promise((resolve, reject) => {
    if (!validateTaskFields(title, description)) {
      reject("Invalid task fields.");
    }
    const detailsTask = new Task({
      title: title,
      description: description,
    });
    detailsTask
      .save()
      .then((result) => resolve(result))
      .catch((err) => reject("Task addition error"));
  });
};

exports.getTask = (id) => {
  return new Promise((resolve, reject) => {
    Task.findById(id)
      .select("title description")
      .then((result) => resolve(result))
      .catch((err) => reject("Task not Found"));
  });
};

exports.updateTask = (id, payload) => {
  return new Promise(async (resolve, reject) => {
    if (payload.title || payload.description) {
      if (!validateTaskFields(payload.title, payload.description)) {
        reject("Invalid task fields.");
      }
    }
    const task = await Task.findOne({ _id: id });
    if (task) {
      const result = await Task.updateOne(
        { _id: id },
        { $set: payload }
      ).exec();
      resolve(result);
    } else {
      console.log("here");
      reject("Task doesn't exist");
    }
  });
};

exports.deleteTask = (id) => {
  return new Promise( async(resolve, reject) => {
    const task = await Task.findOne({ _id: id });
    if (task) {
      const result = await Task.deleteOne({ _id: id }).exec();
      resolve(result);
    } else {
      reject("Task doesn't exist");
    }
  });
};
