import { getTimeZones } from "@vvo/tzdb";

const getOffsetHourFromTimezone = (timezone: string): number => {
  const timezones = getTimeZones();
  const foundTimezone = timezones.find((tz) => tz.name === timezone);
  let offsetInHours = 0;
  if (foundTimezone) {
    const offsetInMinutes = foundTimezone.currentTimeOffsetInMinutes;
    offsetInHours = offsetInMinutes / 60;
  }
  return offsetInHours;
};

export { getOffsetHourFromTimezone };
