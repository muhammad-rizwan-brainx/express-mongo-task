const mongoose = require("mongoose");
const Task = require("../models/taskModel");

const validateTaskFields = (title, description) => {
  if (!title || !description) {
    throw new Error("Title and description are required.");
  }
  return true;
};

exports.getAllTasks = async () => {
  try {
    const docs = await Task.find().select("title description").exec();
    return docs;

  } catch (err) {
    throw err;
  }
};

exports.addTask = async (title, description) => {
  try {
    if (!validateTaskFields(title, description)) {
      throw new Error("Invalid task fields.");
    }

    const detailsTask = new Task({
      title: title,
      description: description,
    });

    const result = await detailsTask.save();
    return result;

  } catch (err) {
    throw err;
  }
};

exports.getTask = async (id) => {
  try {
    const doc = await Task.findById(id).select("title description").exec();
    return doc;

  } catch (err) {
    throw err;
  }
};

exports.updateTask = async (id, payload) => {
  try {
    if (payload.title || payload.description) {
      if (!validateTaskFields(payload.title, payload.description)) {
        throw new Error("Invalid task fields.");
      }
    }

    const result = await Task.updateOne({ _id: id }, { $set: payload }).exec();
    return result;

  } catch (err) {
    throw err;
  }
};

exports.deleteTask = async (id) => {
  try {
    const result = await Task.deleteOne({ _id: id }).exec();
    return result;
    
  } catch (err) {
    throw err;
  }
};
