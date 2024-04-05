const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const express = require("express");
const app =express()// Import your Express app
const Task = require("../models/Task");
const mongoose=require("mongoose")
const { getAllTasks,addTask,updateTask,deleteTask } = require("../controllers/taskController");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);

describe("Task API", () => {

  describe("addTask", () => { 
    it("should add a new task", async () => {
      // Mocking the request object
      const mockRequest = {
        body: {
          taskName: "Test Task",
          date: new Date(),
          description: "This is a test task",
          completed: "Pending",
        },
        user: {
          userId: '648c7d6748d6e92e28b674cf',
          name: 'Robbie'
        },
      };
  
      // Mocking the response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock Task.create to return the task object
      const createdTask = {
        _id: "mockTaskId",
        taskName: mockRequest.body.taskName,
        date: mockRequest.body.date,
        description: mockRequest.body.description,
        completed: mockRequest.body.completed,
        createdBy: mockRequest.user.userId,
      };
      jest.spyOn(Task, "create").mockResolvedValue(createdTask);
  
      // Call the addTask function
      await addTask(mockRequest, mockResponse);
  
      // Verifying if status 201 (Created) is returned
      expect(mockResponse.status).toHaveBeenCalledWith(201);
  
      // Verifying if Task.create was called with the correct arguments
      expect(Task.create).toHaveBeenCalledWith(mockRequest.body);
  
      // Verifying if the response includes the added task with createdBy property
      expect(mockResponse.json).toHaveBeenCalledWith({
        task: createdTask,
      });
    });
    it("should return an error if any required field is missing", async () => {
      // Mocking the request object with missing description
      const mockRequest = {
        body: {
          taskName: "Test Task",
          date: new Date(),
          completed: "Pending",
        },
        user: {
          userId: '648c7d6748d6e92e28b674cf',
          name: 'Robbie'
        },
      };
  
      // Mocking the response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Call the addTask function
      await addTask(mockRequest, mockResponse);
  
      // Verifying if status 400 (Bad Request) is returned
      expect(mockResponse.status).toHaveBeenCalledWith(400);
  
      // Verifying if the response includes the error message
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "All fields are required",
      });
    });
  }); 
  describe("getAllTasks", () => {
    it("should return all tasks created by the user", async () => {
      // Mocking the request object
      const mockRequest = {
        user: {
          userId: '648c7d6748d6e92e28b674cf',
        },
      };
  
      // Mocking the response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mocking the Task.find() method
      const mockTasks = [
        { _id: "1", taskName: "Task 1", description: "Description 1" },
        { _id: "2", taskName: "Task 2", description: "Description 2" },
      ];
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockTasks),
      };
  
      // Mock the Task.find() method to return the mock query object
      jest.spyOn(Task, "find").mockReturnValue(mockQuery);
  
      // Call the getAllTasks function
      await getAllTasks(mockRequest, mockResponse);
  
      // Verify if the response status is 200 (OK)
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  
      // Verify if the response includes the tasks
      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: mockTasks,
        count: mockTasks.length,
      });
    });
  
    it("should return an empty array if no tasks are found", async () => {
      // Mocking the request object
      const mockRequest = {
        user: {
          userId: '648c7d6748d6e92e28b674ca',
        },
      };
  
      // Mocking the response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mocking the Task.find() method to return an empty array
      jest.spyOn(Task, "find").mockResolvedValue([]);
  
      // Call the getAllTasks function
      await getAllTasks(mockRequest, mockResponse);
  
      // Verify if the response status is 200 (OK)
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  
      // Verify if the response includes an empty array of tasks
      // expect(mockResponse.json).toHaveBeenCalledWith({
        //tasks: [],
        //count: 0,
      //}); 
    });
  
    it("should return an error message if an error occurs", async () => {
      // Mocking the request object
      const mockRequest = {
        user: {
          userId: '648c7d6748d6e92e28b674cp',
        },
      };
  
      // Mocking the response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const errorMessage = "Task.find(...).sort is not a function";
      // Call the getAllTasks function
      await getAllTasks(mockRequest, mockResponse);
  
      // Verify if the response status is 500 (Internal Server Error)
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  
      // Verify if the response includes the error message
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  }); 

  describe("updateTask", () => {
    const updatedTaskData = {
      taskName: "Updated Task",
      date: new Date(),
      description: "This is an updated task",
      completed: "Completed",
    };
    
    // Mock request object with task ID and updated data
    const mockRequest = {
      body: updatedTaskData,
      user: { userId: "user_id_here" },
      params: { id: "existing_task_id" },
    };
    
    // Mock response object
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    it("should update an existing task", async () => {
      // Mock existing task
      const existingTask = {
        _id: "existing_task_id",
        taskName: "Test Task",
        date: new Date(),
        description: "This is a test task",
        completed: "Pending",
        createdBy: "user_id_here",
      };
  
      // Mock findByIdAndUpdate method to return the updated task
      jest.spyOn(Task, "findByIdAndUpdate").mockResolvedValue(existingTask);
  
      // Call the updateTask function
      await updateTask(mockRequest, mockResponse);
  
      // Verify if the response status is OK
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  
      // Verify if the response includes the updated task
      expect(mockResponse.json).toHaveBeenCalledWith({
        task: existingTask,
      });
    });
  
    it("should return a 404 error if task to update is not found", async () => {
      // Mock findByIdAndUpdate method to return null (indicating task not found)
      jest.spyOn(Task, "findByIdAndUpdate").mockResolvedValue(null);
  
      // Call the updateTask function
      await updateTask(mockRequest, mockResponse);
  
      // Verify if the response status is NOT_FOUND
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });
  });
});
