import Agenda from "agenda";
import { getTodayBirthdayUsers } from "../repository/UserRepository";

const databaseUri = process.env.DATABASE_URI + "member";

const agenda = new Agenda({
  db: { address: databaseUri, collection: "scheduler" },
  maxConcurrency: 20,
});

agenda.define("addTodaysPushNotifTask", async (job: any) => {
  const users = await getTodayBirthdayUsers();

  users.forEach((user: any) => {
    console.log(`Happy birthday ${user.name}!`);
  });
});

export default agenda;
