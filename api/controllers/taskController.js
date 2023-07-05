const taskService = require("../services/taskService");
const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const taskData = {
      title: req.body.title,
      description: req.body.description,
    };
    const task = await taskService.createTask(taskData);

    res.status(201).json({
      message: "Task Added",
      Task: {
        title: task.title,
        description: task.description,
        id: task._id,
        request: {
          type: "GET",
          url: `${root}/tasks/${task._id}`,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskID;
    const task = await taskService.getTaskById(taskId);

    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskID;
    const payload = req.body;

    const { error } = taskSchema.validate(payload);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedTask = await taskService.updateTask(taskId, payload);
    if (updatedTask) {
      res.status(200).json({ message: "Task updated" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskID;
    const deletedTask = await taskService.deleteTask(taskId);

    if (deletedTask) {
      res.status(200).json({
        message: "Task deleted",
        request: {
          type: "POST",
          url: `${root}/tasks`,
          body: { title: "String", description: "String" },
        },
      });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
