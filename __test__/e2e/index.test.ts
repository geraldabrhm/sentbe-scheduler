import request from "supertest";
import app from "../../express";

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

  it("should return 200 for GET /user", async () => {
    // set cookie "userId=user123"
    const response = await request(app)
      .get("/user/profile")
      .set("Cookie", ["userId=67e8ed529fd6bcaf2b628f0a"]);

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "User route",
      data: { userId: "user123" },
    });
  });

  it("should return 200 for GET /masterdata", async () => {
    const response = await request(app).get("/masterdata");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Master data route" });
  });
});
