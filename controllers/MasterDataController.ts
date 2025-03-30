import { getTimeZones } from "@vvo/tzdb";
import { Request, Response } from "express";
import { getAllAvailableIANATimezones } from "../services/MasterDataService";

const getTimezonesController = async (req: Request, res: Response) => {
  try {
    const {
      success,
      message,
      data,
      status,
    } = getAllAvailableIANATimezones();

    res
      .status(200)
      .json({ success, message, data, status })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  getTimezonesController,
}
