import { PUSH_NOTIF_TIME } from "../constants/scheduler";
import {
  getTodayAndTomorrowDateString,
  isTodayBirthdayUser,
} from "../helpers/TimeHelper";
import User from "../models/User";

/**
 * @description Get users that birthday is from 0 to 23 hours from now (UTC reference)
 * @returns
 */
const getTodayBirthdayUsers = async () => {
  const { today, tomorrow } = getTodayAndTomorrowDateString();

  const todayBirthdayUser = await User.find({
    birthday: { $gte: today, $lte: tomorrow },
  });

  const todayBirthdayUserUTCReference = todayBirthdayUser.filter((user) => {
    const isTodayBirthdayUTCReference = isTodayBirthdayUser(
      user.timezone,
      user.birthday
    );
    return isTodayBirthdayUTCReference;
  });

  return todayBirthdayUserUTCReference;
};

export { getTodayBirthdayUsers };
