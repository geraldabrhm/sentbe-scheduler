import mongoose from "mongoose";
import User from "../../../models/User";
import { getTodayBirthdayUsers } from "../../../repository/UserRepository";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../../../helpers/TimeHelper", () => ({
  getTodayAndTomorrowDateString: jest.fn(() => ({
    today: "2025-04-02",
    tomorrow: "2025-04-03",
  })),
  isTodayBirthdayUser: jest.fn((timezone, birthday) => true),
}));

describe("getTodayBirthdayUsers", () => {
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

  it("should return users whose birthday is today based on timezone", async () => {
    await User.create([
      {
        name: "Alice",
        birthday: "2025-04-02",
        timezone: "Asia/Jakarta",
        email: "alice@gmail.com",
      },
      {
        name: "Bob",
        birthday: "2025-04-01",
        timezone: "America/New_York",
        email: "bob@gmail.com",
      },
      {
        name: "Charlie",
        birthday: "2025-04-03",
        timezone: "Australia/Sydney",
        email: "charlie@gmail.com",
      },
    ]);

    const result = await getTodayBirthdayUsers();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Alice");
    expect(result[1].name).toBe("Charlie");
  });
});
