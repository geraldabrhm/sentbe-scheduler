import { PUSH_NOTIF_TIME } from "../constants/scheduler";
import { getOffsetHourFromTimezone } from "../helpers/TimeHelper";
import User from "../models/User";

/**
 * @description Get users that birthday is from 0 to 23 hours from now (UTC reference)
 * @returns
 */
const getTodayBirthdayUsers = async () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const todayBirthdayUser = await User.find({
    birthday: { $gte: todayString, $lte: tomorrowString },
  });

  const todayBirthdayUserUTCReference = todayBirthdayUser.filter((user) => {
    const offsetInHours = getOffsetHourFromTimezone(user.timezone);
    let isTodayBirthdayUTCReference = false;

    if (offsetInHours < PUSH_NOTIF_TIME) {
      isTodayBirthdayUTCReference = user.birthday === todayString;
    } else {
      isTodayBirthdayUTCReference = user.birthday === tomorrowString;
    }
    return isTodayBirthdayUTCReference;
  });

  return todayBirthdayUserUTCReference;
};

export { getTodayBirthdayUsers };
