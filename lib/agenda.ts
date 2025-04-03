import dotenv from "dotenv";
dotenv.config();

import Agenda from "agenda";
import { getTodayBirthdayUsers } from "../repository/UserRepository";
import { getOffsetHourOnString } from "../helpers/TimeHelper";
import { sendEmail } from "./nodemailer";

const databaseUri = process.env.DATABASE_URI + "member";

const agenda = new Agenda({
  db: { address: databaseUri, collection: "scheduler" },
  maxConcurrency: 20,
});

agenda.define("addTodaysPushNotifTask", async (job: any) => {
  const users = await getTodayBirthdayUsers();

  const schedulerPromises = users.map((user: any) => {
    const pushNotifTime9UserTimezone = getOffsetHourOnString(
      user.timezone,
      user.birthday
    );
    return agenda.schedule(
      pushNotifTime9UserTimezone,
      "sendEmailToBirthdayUser",
      {
        email: user.email,
        name: user.name,
        birthday: user.birthday,
      }
    );
  });
  await Promise.all(schedulerPromises);
});

agenda.define("sendEmailToBirthdayUser", async (job: any) => {
  sendEmail(
    job.attrs.data.email,
    "Happy Birthday!",
    `Happy birthday ${job.attrs.data.name}, we wish you all the best on your special day!`
  );
});

export default agenda;
