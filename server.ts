import agenda from "./lib/agenda";
import app from "./express";
import connectToDatabase from "./lib/mongoose";
import dotenv from "dotenv";
import { QUERY_USER_BIRTHDAY_AGENDA_INTERVAL } from "./constants/scheduler";

dotenv.config();
connectToDatabase();

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = app.listen(port);

server.on("listening", () => {
  const address = server.address();
  if (address && typeof address !== "string") {
    const hostname = address.address;
    const port = address.port;

    console.log(`[Server] Listening at http://${hostname}:${port}`);
  }
});

agenda.on("ready", async () => {
  console.log("[Agenda] Agenda is ready, starting jobs...");
  await agenda.start();
  console.log("[Agenda] Agenda started");

  await agenda.every(
    QUERY_USER_BIRTHDAY_AGENDA_INTERVAL,
    "addTodaysPushNotifTask",
    {},
    {
      timezone: "UTC",
    }
  );
});

agenda.on("error", (err) => {
  console.error("[Agenda] Agenda error", err);
});
