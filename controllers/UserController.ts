import { Request, Response, NextFunction } from "express";
import {
  getProfile,
  registerUser,
  removeUser,
  updateUser,
} from "../services/UserService";
import { MILLISECOND_IN_A_DAY } from "../constants/scheduler";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, name, birthday, timezone } = req.body;

    const { success, message, data, status } = await registerUser(
      email,
      name,
      birthday,
      timezone
    );

    if (status === 201) {
      res.cookie("userId", data.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: MILLISECOND_IN_A_DAY,
      });
    }
    res.status(status).json({ success, message, data });
  } catch (err) {
    console.error(err);
  }
};

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.userId as string;

    const { success, message, data, status } = await getProfile(userId);

    res.status(status).json({ success, message, data });
  } catch (err) {
    console.error(err);
  }
};

export const removeuserController = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.userId as string;

    const { success, message, data, status } = await removeUser(userId);

    res.status(status).json({ success, message, data });
  } catch (err) {
    console.error(err);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.userId as string;
    const { email, name, birthday, timezone } = req.body;

    const { success, message, data, status } = await updateUser(
      userId,
      email,
      name,
      birthday,
      timezone
    );

    res.status(status).json({ success, message, data });
  } catch (err) {
    console.error(err);
  }
};
