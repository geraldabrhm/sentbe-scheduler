import User from "../models/User";
import { ServiceOutput } from "../models/ServiceOutput";
import agenda from "../lib/agenda";
import {
  getOffsetHourOnString,
  isTodayBirthdayUser,
} from "../helpers/TimeHelper";
import {
  addNewUser,
  deleteUser,
  getUserByUserId,
  updateUser,
} from "../repository/UserRepository";
import {
  ERROR_COMMON_GET_PROFILE_MESSAGE,
  ERROR_COMMON_REGISTER_MESSAGE,
  ERROR_COMMON_REMOVE_USER_MESSAGE,
  ERROR_COMMON_UPDATE_USER_MESSAGE,
  ERROR_DUPLICATE_EMAIL_MESSAGE,
  ERROR_INVALID_DATA_FORMAT,
  ERROR_USER_NOT_FOUND_MESSAGE,
  SUCCESS_GET_PROFILE_MESSAGE,
  SUCCESS_REGISTER_MESSAGE,
  SUCCESS_REMOVE_USER_MESSAGE,
  SUCCESS_UPDATE_USER_MESSAGE,
} from "../constants/serviceResponseMessage";

export const registerUser = async (
  email: string,
  name: string,
  birthday: string,
  timezone: string
): Promise<ServiceOutput> => {
  try {
    const user = await addNewUser(email, name, birthday, timezone);

    const isBirthdayUserToday = isTodayBirthdayUser(
      user.timezone,
      user.birthday
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

export const getProfile = async (userId: string): Promise<ServiceOutput> => {
  try {
    const user = await getUserByUserId(userId);

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

export const removeUser = async (userId: string): Promise<ServiceOutput> => {
  try {
    const user = await deleteUser(userId);

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

export const updateUserService = async (
  userId: string,
  email: string,
  name: string,
  birthday: string,
  timezone: string
): Promise<ServiceOutput> => {
  try {
    const user = await updateUser(userId, email, name, birthday, timezone);

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
      message: SUCCESS_UPDATE_USER_MESSAGE,
      data: user,
      status: 200,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return {
        success: false,
        message: ERROR_INVALID_DATA_FORMAT,
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
        message: ERROR_COMMON_UPDATE_USER_MESSAGE,
        data: null,
        status: 500,
      };
    }
  }
};
