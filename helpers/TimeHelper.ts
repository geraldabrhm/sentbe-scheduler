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

const convertOffsetToString = (offset: number): string => {
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export { getOffsetHourFromTimezone, convertOffsetToString };
