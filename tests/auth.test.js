const { login } = require("../controllers/authController");
const { User } = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

describe("Login Controller", () => {
  it("should successfully login with correct credentials", async () => {
    const mockRequest = {
      body: {
        email: "andyrobertson@gmail.com",
        password: "liverpool",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userData = {
      email: "andyrobertson@gmail.com",
      password: "liverpool",
      name: "Andy Robertson"
    };

    jest.spyOn(User, "findOne").mockResolvedValue(userData);
    jest.spyOn(userData, "comparePassword").mockResolvedValue(true);

    await login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: { name: userData.name },
      token: expect.any(String),
    });
  });

  it("should return 400 if email or password is missing", async () => {
    const mockRequest = {
      body: {},
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: new BadRequestError("Please provide email and password"),
    });
  });

  it("should return 401 if user does not exist", async () => {
    const mockRequest = {
      body: {
        email: "nonexistent@example.com",
        password: "password123",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null);

    await login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: new UnauthenticatedError("Invalid Credentials"),
    });
  });

  it("should return 401 if password is incorrect", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockRequest = {
      body: {
        email: userData.email,
        password: "incorrectpassword",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(userData);
    jest.spyOn(userData, "comparePassword").mockResolvedValue(false);

    await login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: new UnauthenticatedError("Invalid Credentials"),
    });
  });
});
