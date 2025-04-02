import User from "../models/User";
import { ServiceOutput } from "../models/ServiceOutput";
import { getTodayBirthdayUsers } from "../repository/UserRepository";
import agenda from "../lib/agenda";
import { getOffsetHourOnString } from "../helpers/TimeHelper";

const SUCCESS_REGISTER_MESSAGE = "User registered successfully";
const ERROR_COMMON_REGISTER_MESSAGE = "User registration failed";
const ERROR_DUPLICATE_EMAIL_MESSAGE = "Email already exists";

export const registerUser = async (
  email: string,
  name: string,
  birthday: Date,
  timezone: string
): Promise<ServiceOutput> => {
  try {
    const user = new User({
      email,
      name,
      birthday,
      timezone,
    });

    await user.save();

    const todayBirthdayUser = await getTodayBirthdayUsers();

    const isBirthdayUserToday = todayBirthdayUser.some(
      (user) => user.userId === user.userId
    );

    if (isBirthdayUserToday) {
      const pushNotifTime9UserTimezone = getOffsetHourOnString(
        user.timezone,
        user.birthday
      );
      await agenda.schedule(
        pushNotifTime9UserTimezone,
        "sendEmailToBirthdayUser",
        {
          email: user.email,
          name: user.name,
          birthday: user.birthday,
        }
      );
    }

    return {
      success: true,
      message: SUCCESS_REGISTER_MESSAGE,
      data: {
        email: user.email,
        name: user.name,
        birthday: user.birthday,
        timezone: user.timezone,
        userId: user.userId,
      },
      status: 201,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "MongoServerError" &&
      (error as any).code === 11000
    ) {
      return {
        success: false,
        message: ERROR_DUPLICATE_EMAIL_MESSAGE,
        data: null,
        status: 409,
      };
    } else if (error instanceof Error && error.name === "ValidationError") {
      return {
        success: false,
        message: error.message,
        data: null,
        status: 400,
      };
    } else {
      return {
        success: false,
        message: ERROR_COMMON_REGISTER_MESSAGE,
        data: null,
        status: 500,
      };
    }
  }
};

const SUCCESS_GET_PROFILE_MESSAGE = "User profile retrieved successfully";
const ERROR_COMMON_GET_PROFILE_MESSAGE = "Error retrieving user profile";
const ERROR_USER_NOT_FOUND_MESSAGE = "User not found";

export const getProfile = async (userId: string): Promise<ServiceOutput> => {
  try {
    const user = await User.findOne({ userId }).select("-__v -_id");

    if (!user) {
      return {
        success: false,
        message: ERROR_USER_NOT_FOUND_MESSAGE,
        data: null,
        status: 404,
      };
    }

    return {
      success: true,
      message: SUCCESS_GET_PROFILE_MESSAGE,
      data: user,
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: ERROR_COMMON_GET_PROFILE_MESSAGE,
      data: null,
      status: 500,
    };
  }
};

const SUCCESS_REMOVE_USER_MESSAGE = "User removed successfully";
const ERROR_COMMON_REMOVE_USER_MESSAGE = "Error removing user";
const ERROR_USER_NOT_FOUND_REMOVE_MESSAGE = "User not found";

export const removeUser = async (userId: string): Promise<ServiceOutput> => {
  try {
    const user = await User.findOneAndDelete({ userId });

    if (!user) {
      return {
        success: false,
        message: ERROR_USER_NOT_FOUND_REMOVE_MESSAGE,
        data: null,
        status: 404,
      };
    }

    return {
      success: true,
      message: SUCCESS_REMOVE_USER_MESSAGE,
      data: null,
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: ERROR_COMMON_REMOVE_USER_MESSAGE,
      data: null,
      status: 500,
    };
  }
};

export const updateUser = async (
  userId: string,
  email: string,
  name: string,
  birthday: Date,
  timezone: string
): Promise<ServiceOutput> => {
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { email, name, birthday, timezone },
      { new: true, runValidators: true }
    ).select("-__v -_id");

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
        status: 404,
      };
    }

    return {
      success: true,
      message: "User updated successfully",
      data: user,
      status: 200,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return {
        success: false,
        message: "Invalid data format",
        data: null,
        status: 400,
      };
    } else if (error instanceof Error && error.name === "ValidationError") {
      return {
        success: false,
        message: error.message,
        data: null,
        status: 400,
      };
    } else if (
      error instanceof Error &&
      error.name === "MongoServerError" &&
      (error as any).code === 11000
    ) {
      return {
        success: false,
        message: ERROR_DUPLICATE_EMAIL_MESSAGE,
        data: null,
        status: 409,
      };
    } else {
      return {
        success: false,
        message: "Error updating user",
        data: null,
        status: 500,
      };
    }
  }
};
