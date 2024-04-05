const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index.js");

const addTask = async (req, res) => {
    try {
      const { taskName, date, description, completed } = req.body;
      if (!taskName || !date || !description || !completed) {
        throw new BadRequestError("All fields are required");
      }
  
      req.body.createdBy = req.user.userId;
      const task = await Task.create(req.body);
      res.status(StatusCodes.CREATED).json({ task });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
    }
  };

  const getAllTasks = async (req, res) => {
    try {
      
      const tasks = await Task.find({ createdBy: req.user.userId }).sort(
        "createdAt"
      );
      console.log("Hi ",tasks)
      res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
    } catch (error) {
      console.log("Hi ",error.message)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };

  const updateTask = async (req, res) => {
    try {
      const {
        body: { completed },
        user: { userId },
        params: { id: taskId },
      } = req;
  
      if (completed === "") {
        throw new BadRequestError("Completed Field cannot be empty");
      }
  
      // Find the task by ID and update it
      const task = await Task.findByIdAndUpdate(
        taskId,
        { ...req.body, createdBy: userId }, // Include userId for validation
        { new: true, runValidators: true }
      );
  
      if (!task) {
        throw new NotFoundError(`No task found with id ${taskId}`);
      }
  
      res.status(StatusCodes.OK).json({ task });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
    }
  };
  
  
  const deleteTask = async (req, res) => {
    try {
      const {
        user: { userId },
        params: { id: taskId },
      } = req;
      console.log("Req is ",req)
      // Find the task by ID and delete it
      const task = await Task.findByIdAndRemove(taskId);
  
      if (!task) {
        throw new NotFoundError(`No task found with id ${taskId}`);
      }
  
      res.status(StatusCodes.OK).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
    }
  };

  module.exports = {
    addTask,
    deleteTask,
    getAllTasks,
    updateTask,
  };