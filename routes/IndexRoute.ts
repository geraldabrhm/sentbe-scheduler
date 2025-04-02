import { Router, Request, Response } from "express";

const IndexRoute = Router();

IndexRoute.route("/").get(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API",
    data: {
      endpoints: [],
    },
  });
});

export default IndexRoute;
