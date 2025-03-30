import { Router } from "express";
import { getTimezonesController } from "../controllers/MasterDataController";

const MasterDataRoute = Router();

MasterDataRoute.route("/timezones").get(getTimezonesController);

export default MasterDataRoute;
