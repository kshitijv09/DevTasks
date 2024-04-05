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

  module.exports = {
    addTask,
    deleteTask,
    getAllTasks,
    updateTask,
  };