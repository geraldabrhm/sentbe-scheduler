import { getTimeZones } from "@vvo/tzdb";
import { ServiceOutput } from "../models/ServiceOutput";

const SUCCESS_GET_MASTERDATA_MESSAGE = "Master data fetched successfully";

const getAllAvailableIANATimezones = (): ServiceOutput => {
  try {
    const timezones = getTimeZones();
    const timezoneNames = timezones.map((timezone) => timezone.name);
    const length = timezoneNames.length;

    return {
      success: true,
      message: SUCCESS_GET_MASTERDATA_MESSAGE,
      data: {
        length: length,
        timezones: timezoneNames,
      },
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch timezones",
      data: null,
      status: 500,
    };
  }
}

export {
  getAllAvailableIANATimezones,
}