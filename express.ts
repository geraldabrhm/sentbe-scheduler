import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generateUUID } from "./helpers/CommonHelper";
import IndexRoute from "./routes/IndexRoute";
import AuthRoute from "./routes/UserRoute";
import MasterDataRoute from "./routes/MasterDataRoute";

const app: Express = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use((req, res, next) => {
  const traceId = generateUUID();
  res.setHeader("X-Trace-Id", traceId);

  const originalSend = res.send.bind(res);

  res.send = function (body) {
    const timestamp = new Date().toISOString();
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;

    const logRequest = `[${traceId}][${timestamp}] [//] HTTP Server Send Message [//] ${req.method} ${url} ${JSON.stringify(req.headers)} ${JSON.stringify(req.body)}`;
    const logResponse = `[${traceId}][${timestamp}] [//] HTTP Server Send Message [//] ${body}`;

    console.log(logRequest);
    console.log(logResponse);

    return originalSend(body);
  };

  next();
});

app.use("/", IndexRoute);
app.use("/user", AuthRoute);
app.use("/masterdata", MasterDataRoute);

export default app;
