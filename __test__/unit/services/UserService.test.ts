import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../../models/User";
import {
  getProfile,
  registerUser,
  removeUser,
  updateUserService,
} from "../../../services/UserService";
import agenda from "../../../lib/agenda";

jest.mock("../../../helpers/TimeHelper", () => ({
  isTodayBirthdayUser: jest.fn(() => true),
  getOffsetHourOnString: jest.fn(() => "2025-04-02T09:00:00.000Z"),
}));

jest.mock("../../../lib/agenda", () => ({
  schedule: jest.fn(),
}));

describe("registerUser", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should register a user and schedule a birthday email if today is their birthday", async () => {
    const result = await registerUser(
      "test@example.com",
      "Test User",
      "2025-04-02",
      "Asia/Jakarta"
    );

    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(agenda.schedule).toHaveBeenCalledWith(
      "2025-04-02T09:00:00.000Z",
      "sendEmailToBirthdayUser",
      {
        email: "test@example.com",
        name: "Test User",
        birthday: "2025-04-02",
      }
    );
  });

  it("should return a 409 error when trying to register a duplicate email", async () => {
    await registerUser(
      "duplicate@example.com",
      "User One",
      "2025-04-02",
      "Asia/Jakarta"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await registerUser(
      "duplicate@example.com",
      "User Two",
      "2025-04-02",
      "Asia/Jakarta"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(409);
  });

  it("should return a 400 error for validation errors", async () => {
    const result = await registerUser(
      "invalid-email",
      "",
      "invalid-date",
      "Asia/Jakarta"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  it("should return a 500 error for unexpected errors", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Unexpected error"));

    const result = await registerUser(
      "error@example.com",
      "Error User",
      "2025-04-02",
      "Asia/Jakarta"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
  });
});

describe("getProfile", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });
  it("should return user profile when user exists", async () => {
    const user = await User.create({
      userId: "12345",
      email: "user@example.com",
      name: "Test User",
      birthday: "1990-01-01",
      timezone: "Asia/Jakarta",
    });

    const result = await getProfile("12345");

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({
      userId: user.userId,
      email: user.email,
      name: user.name,
      birthday: user.birthday,
      timezone: user.timezone,
    });
  });

  it("should return 404 error when user is not found", async () => {
    const result = await getProfile("nonexistent");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });
});

describe("removeUser", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should remove a user successfully", async () => {
    await User.create({
      userId: "12345",
      email: "user@example.com",
      name: "Test User",
      timezone: "Asia/Jakarta",
      birthday: "1990-01-01",
    });

    const result = await removeUser("12345");

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
  });

  it("should return 404 if user does not exist", async () => {
    const result = await removeUser("nonexistent");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  it("should return 500 on unexpected error", async () => {
    jest
      .spyOn(User, "findOneAndDelete")
      .mockRejectedValue(new Error("Unexpected error"));

    const result = await removeUser("errorcase");

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
  });
});

describe("updateUserService", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should update a user successfully", async () => {
    await User.create({
      userId: "12345",
      email: "user@example.com",
      name: "Test User",
      birthday: "1990-01-01",
      timezone: "Asia/Jakarta",
    });

    const result = await updateUserService(
      "12345",
      "new@example.com",
      "New Name",
      "1995-05-05",
      "Asia/Bangkok"
    );

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({
      email: "new@example.com",
      name: "New Name",
      birthday: "1995-05-05",
      timezone: "Asia/Bangkok",
    });
  });

  it("should return 404 if user does not exist", async () => {
    const result = await updateUserService(
      "nonexistent",
      "new@example.com",
      "New Name",
      "1995-05-05",
      "Asia/Bangkok"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  it("should return 400 on invalid data format", async () => {
    const result = await updateUserService(
      "12345",
      "invalid-email",
      "",
      "invalid-date",
      ""
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toBe(
      "Validation failed: timezone: Path `timezone` is required., birthday: invalid-date is not a valid date! Use the format YYYY-MM-DD., name: Path `name` is required., email: invalid-email is not a valid email address!"
    );
  });
});
