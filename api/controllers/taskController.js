const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const dotenv = require("dotenv")
dotenv.config()
const root = process.env.ROOT;
exports.getAllTasks = (re, res, next) => {
    Task.find().select('title description').exec()
        .then(docs => {
            const response = {
                count: docs.length,
                tasks: docs.map(doc => {
                    return {
                        title: doc.title,
                        description: doc.description,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: root + '/tasks/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.addTask = (req, res, next) => {
    const detailsTask = new
        Task({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
        });
    detailsTask.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Task Added",
            Task: {
                title: result.title,
                description: result.description,
                id: result._id,
                request: {
                    type: 'GET',
                    url: root + '/tasks/' + result._id
                }
            }
        });
    }).catch(err => console.log(err));

}


exports.getTask = (req, res, next) => {
    const id = req.params.taskID;
    console.log(id)
    Task.findById(id).select('title description').exec().then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}


exports.updateTask = (req, res, next) => {
    const id = req.params.taskID;
    const payload = req.body;
    Task.updateOne({ id }, { $set: payload })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.deleteTask = (req, res, next) => {
    const _id = req.params.taskID;
    Task.deleteOne({ _id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Task deleted",
                request: {
                    type: "POST",
                    url: root + "/tasks",
                    body: { title: "String", description: "String" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};