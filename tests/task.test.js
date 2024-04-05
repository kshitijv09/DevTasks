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
  

  
  

  
});
