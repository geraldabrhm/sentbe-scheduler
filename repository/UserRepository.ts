import { PUSH_NOTIF_TIME } from "../constants/scheduler";
import {
  getTodayAndTomorrowDateString,
  isTodayBirthdayUser,
} from "../helpers/TimeHelper";
import User, { IUser } from "../models/User";

const addNewUser = async (
  email: string,
  name: string,
  birthday: string,
  timezone: string
): Promise<IUser> => {
  const user = new User({
    email,
    name,
    birthday,
    timezone,
  });

  return await user.save();
};

const getUserByUserId = async (userId: string): Promise<IUser | null> => {
  const user = await User.findOne({ userId }).select("-__v -_id");
  return user;
};

const deleteUser = async (userId: string): Promise<IUser | null> => {
  const user = await User.findOneAndDelete({ userId });

  return user;
};

const updateUser = async (
  userId: string,
  email: string,
  name: string,
  birthday: string,
  timezone: string
): Promise<IUser | null> => {
  const user = await User.findOneAndUpdate(
    { userId },
    { email, name, birthday, timezone },
    { new: true, runValidators: true }
  ).select("-__v -_id");

  return user;
};

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

export {
  addNewUser,
  getUserByUserId,
  deleteUser,
  updateUser,
  getTodayBirthdayUsers,
};
