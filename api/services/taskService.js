const mongoose = require("mongoose");
const Joi = require("joi");
const Task = require("../models/taskModel");

const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

exports.getAllTasks = async () => {
    try {
        const docs = await Task.find().select("title description").exec();
        return {
            count: docs.length,
            tasks: docs.map(doc => {
                return {
                    title: doc.title,
                    description: doc.description,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: `${root}/tasks/${doc._id}`
                    }
                };
            })
        };
    } catch (err) {
        throw err;
    }
};

exports.addTask = async (taskData) => {
    try {
        const { error } = taskSchema.validate(taskData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const newTask = new Task({
            _id: new mongoose.Types.ObjectId(),
            title: taskData.title,
            description: taskData.description
        });
        const result = await newTask.save();
        return {
            title: result.title,
            description: result.description,
            id: result._id,
            request: {
                type: "GET",
                url: `${root}/tasks/${result._id}`
            }
        };
    } catch (err) {
        throw err;
    }
};

exports.getTask = async (taskId) => {
    try {
        const doc = await Task.findById(taskId).select("title description").exec();
        return doc;
    } catch (err) {
        throw err;
    }
};

exports.updateTask = async (taskId, payload) => {
    try {
        const { error } = taskSchema.validate(payload);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const result = await Task.updateOne({ _id: taskId }, { $set: payload }).exec();
        return result;
    } catch (err) {
        throw err;
    }
};

exports.deleteTask = async (taskId) => {
    try {
        const result = await Task.deleteOne({ _id: taskId }).exec();
        return result;
    } catch (err) {
        throw err;
    }
};
