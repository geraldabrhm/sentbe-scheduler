import { getTimeZones } from "@vvo/tzdb";
import { getOffsetHourFromTimezone } from "../../../helpers/TimeHelper";

jest.mock("@vvo/tzdb", () => ({
  getTimeZones: jest.fn(),
}));

describe("TimeHelper", () => {
  describe("getOffsetHourFromTimezone", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return correct offset hours for a valid timezone", () => {
      (getTimeZones as jest.Mock).mockReturnValue([
        { name: "Asia/Jakarta", currentTimeOffsetInMinutes: 420 }, // UTC+7
        { name: "America/New_York", currentTimeOffsetInMinutes: -300 }, // UTC-5
      ]);

      expect(getOffsetHourFromTimezone("Asia/Jakarta")).toBe(7);
      expect(getOffsetHourFromTimezone("America/New_York")).toBe(-5);
    });

    it("should return 0 for an invalid timezone", () => {
      (getTimeZones as jest.Mock).mockReturnValue([
        { name: "Asia/Jakarta", currentTimeOffsetInMinutes: 420 },
      ]);

      expect(getOffsetHourFromTimezone("Invalid/Timezone")).toBe(0);
    });

    it("should handle fractional hour offsets correctly", () => {
      (getTimeZones as jest.Mock).mockReturnValue([
        { name: "Asia/Kolkata", currentTimeOffsetInMinutes: 330 }, // UTC+5:30
      ]);

      expect(getOffsetHourFromTimezone("Asia/Kolkata")).toBe(5.5);
    });

    it("should handle empty timezone list", () => {
      (getTimeZones as jest.Mock).mockReturnValue([]);

      expect(getOffsetHourFromTimezone("Asia/Jakarta")).toBe(0);
    });
  });
});
