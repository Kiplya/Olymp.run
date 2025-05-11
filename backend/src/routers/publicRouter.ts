import { Router } from "express";
import dotenv from "dotenv";
import { registerAdmin } from "../utils/user";
import UserController from "../controllers/UserController";

dotenv.config();
const publicRouter = Router();

if (process.env.MODE === "development") {
  publicRouter.post("/adminRegistration", registerAdmin);
}

publicRouter.post("/login", UserController.login);

export default publicRouter;
