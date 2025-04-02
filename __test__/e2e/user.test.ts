import request from "supertest";
import app from "../../express";
import connectToDatabase from "../../lib/mongoose";
import exp from "constants";

connectToDatabase();

describe("E2E Tests", () => {
  it("should return 200 for GET /", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Welcome to the API",
      data: { endpoints: [] },
    });
  });

  it("should return failed register because invalid email", async () => {
    const response = await request(app).post("/user/register").send({
      email: "invalid-email",
      password: "password123",
      name: "User One",
      birthday: "2025-04-04",
      timezone: "Australia/Sydney",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message:
        "User validation failed: email: invalid-email is not a valid email address!",
      data: null,
    });
  });

  it("should return 200 for GET /user", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Cookie", ["userId=67e96690fa69253085c2f1f8"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        birthday: "2025-04-04",
        email: "user2@gmail.com",
        name: "User Dua",
        timezone: "Australia/Sydney",
        userId: "67e96690fa69253085c2f1f8",
      },
    });
  });

  it("should return 200 for GET /masterdata/timezones", async () => {
    const response = await request(app).get("/masterdata/timezones");
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Master data fetched successfully");
  });
});
