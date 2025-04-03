import dotenv from "dotenv";
dotenv.config();

import Agenda from "agenda";
import { getTodayBirthdayUsers } from "../repository/UserRepository";
import { getOffsetHourOnString } from "../helpers/TimeHelper";
import { sendEmail } from "./nodemailer";
import { ONE_HOUR_IN_MILLISECOND } from "../constants/scheduler";

const databaseUri = process.env.DATABASE_URI + "member";

const agenda = new Agenda({
  db: { address: databaseUri, collection: "scheduler" },
  maxConcurrency: 20,
});

agenda.define("addTodaysPushNotifTask", async (job: any) => {
  try {
    const users = await getTodayBirthdayUsers();

    if (users.length === 0) {
      console.log("[Agenda] No users with birthdays today.");
      return;
    }

    const schedulerPromises = users.map(async (user) => {
      try {
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
            timestamp: pushNotifTime9UserTimezone,
          }
        );
      } catch (error) {
        console.error(
          `Failed to schedule notification for ${user.email}:`,
          error
        );
      }
    });

    await Promise.allSettled(schedulerPromises);
  } catch (error) {
    console.error(
      "[Agenda] Failed to add today's push notification task:",
      error
    );
  }
});

agenda.define("sendEmailToBirthdayUser", async (job: any) => {
  try {
    await sendEmail(
      job.attrs.data.email,
      "Happy Birthday!",
      `Happy birthday ${job.attrs.data.name}, we wish you all the best on your special day!`
    );
  } catch (error) {
    console.error(
      `[Agenda] Failed to send email to ${job.attrs.data.email}, retrying...`,
      error
    );

    const oneHourFromNow = new Date(Date.now() + ONE_HOUR_IN_MILLISECOND);
    await agenda.schedule(
      oneHourFromNow,
      "sendEmailToBirthdayUser",
      job.attrs.data
    );
  }
});

export default agenda;
