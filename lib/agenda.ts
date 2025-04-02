import Agenda from "agenda";
import { getTodayBirthdayUsers } from "../repository/UserRepository";
import {
  getOffsetHourOnString,
} from "../helpers/TimeHelper";
import { PUSH_NOTIF_TIME_HHMMSS } from "../constants/scheduler";
import { sendEmail } from "./nodemailer";

const databaseUri = process.env.DATABASE_URI + "member";

const agenda = new Agenda({
  db: { address: databaseUri, collection: "scheduler" },
  maxConcurrency: 20,
});

agenda.define("addTodaysPushNotifTask", async (job: any) => {
  const users = await getTodayBirthdayUsers();

  users.forEach(async (user: any) => {
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
  });
});

agenda.define("sendEmailToBirthdayUser", async (job: any) => {
  sendEmail(
    job.attrs.data.email,
    "Happy Birthday!",
    `Happy birthday ${job.attrs.data.name}, we wish you all the best on your special day!`
  );
});

export default agenda;
