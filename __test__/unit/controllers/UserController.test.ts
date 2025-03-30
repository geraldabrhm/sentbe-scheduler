import { mock } from "node:test";
import {
  registerUserController,
  getProfileController,
  removeuserController,
  updateUserController,
} from "../../../controllers/UserController";
import * as UserService from "../../../services/UserService";

jest.mock("../../../services/UserService");

describe("UserController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("registerUserController", () => {
    it("should register a user and set a cookie", async () => {
      req.body = {
        email: "test@example.com",
        name: "Test User",
        birthday: "1990-01-01",
        timezone: "UTC",
      };

      const mockServiceResponse = {
        success: true,
        message: "User registered successfully",
        data: { userId: "user123" },
        status: 201,
      };

      (UserService.registerUser as jest.Mock).mockResolvedValue(
        mockServiceResponse
      );

      await registerUserController(req, res);

      expect(UserService.registerUser).toHaveBeenCalledWith(
        "test@example.com",
        "Test User",
        "1990-01-01",
        "UTC"
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "userId",
        "user123",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User registered successfully",
        data: { userId: "user123" },
      });
    });

    it("should not set cookie when status is not 201", async () => {
      req.body = {
        email: "test@example.com",
        name: "Test User",
        birthday: "1990-01-01",
        timezone: "UTC",
      };

      const mockServiceResponse = {
        success: false,
        message: "Registration failed",
        data: null,
        status: 400,
      };

      (UserService.registerUser as jest.Mock).mockResolvedValue(
        mockServiceResponse
      );

      await registerUserController(req, res);

      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getProfileController", () => {
    it("should retrieve user profile", async () => {
      req.cookies.userId = "user123";

      const mockServiceResponse = {
        success: true,
        message: "Profile retrieved",
        status: 200,
        data: { name: "Test User", email: "test@example.com" },
      };

      (UserService.getProfile as jest.Mock).mockResolvedValue(
        mockServiceResponse
      );

      await getProfileController(req, res);

      expect(UserService.getProfile).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: mockServiceResponse.success,
        message: mockServiceResponse.message,
        data: mockServiceResponse.data,
      });
    });
  });

  describe("removeuserController", () => {
    it("should remove a user", async () => {
      req.cookies.userId = "user123";

      const mockServiceResponse = {
        success: true,
        message: "User removed",
        data: null,
        status: 200,
      };

      (UserService.removeUser as jest.Mock).mockResolvedValue(
        mockServiceResponse
      );

      await removeuserController(req, res);

      expect(UserService.removeUser).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: mockServiceResponse.success,
        message: mockServiceResponse.message,
        data: mockServiceResponse.data,
      });
    });
  });

  describe("updateUserController", () => {
    it("should update user information", async () => {
      req.cookies.userId = "user123";
      req.body = {
        email: "updated@example.com",
        name: "Updated User",
        birthday: "1991-01-01",
        timezone: "GMT",
      };

      const mockServiceResponse = {
        success: true,
        message: "User updated",
        data: { name: "Updated User" },
        status: 200,
      };

      (UserService.updateUser as jest.Mock).mockResolvedValue(
        mockServiceResponse
      );

      await updateUserController(req, res);

      expect(UserService.updateUser).toHaveBeenCalledWith(
        "user123",
        "updated@example.com",
        "Updated User",
        "1991-01-01",
        "GMT"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: mockServiceResponse.success,
        message: mockServiceResponse.message,
        data: mockServiceResponse.data,
      });
    });
  });
});
