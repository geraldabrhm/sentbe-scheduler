import { Router } from "express";
import { registerUserController, getProfileController, removeuserController, updateUserController } from "../controllers/UserController";

const UserRoute = Router();

UserRoute
    .route('/register')
    .post(registerUserController)

UserRoute
    .route('/profile')
    .get(getProfileController)
    .delete(removeuserController)
    .put(updateUserController)

export default UserRoute;