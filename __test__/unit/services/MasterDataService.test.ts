import { getAllAvailableIANATimezones } from "../../../services/MasterDataService";
import * as tzdb from "@vvo/tzdb";

jest.mock("@vvo/tzdb");

describe("MasterDataService", () => {
  describe("getAllAvailableIANATimezones", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return timezones successfully", () => {
      const mockTimezones = [
        { name: "Asia/Tokyo" },
        { name: "Europe/London" },
        { name: "America/New_York" },
      ];

      (tzdb.getTimeZones as jest.Mock).mockReturnValue(mockTimezones);

      const result = getAllAvailableIANATimezones();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Master data fetched successfully");
      expect(result.status).toBe(200);
      expect(result.data.length).toBe(3);
      expect(result.data.timezones).toEqual([
        "Asia/Tokyo",
        "Europe/London",
        "America/New_York",
      ]);
      expect(tzdb.getTimeZones).toHaveBeenCalledTimes(1);
    });

    it("should handle errors and return failure response", () => {
      (tzdb.getTimeZones as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to fetch timezones");
      });

      const result = getAllAvailableIANATimezones();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Failed to fetch timezones");
      expect(result.status).toBe(500);
      expect(result.data).toBeNull();
      expect(tzdb.getTimeZones).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no timezones are available", () => {
      (tzdb.getTimeZones as jest.Mock).mockReturnValue([]);

      const result = getAllAvailableIANATimezones();

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(0);
      expect(result.data.timezones).toEqual([]);
    });
  });
});
