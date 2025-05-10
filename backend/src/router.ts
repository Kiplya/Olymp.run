import dotenv from "dotenv";
import { Router } from "express";
import UserController from "./controllers/UserController";
import { ResponseStatus } from "@shared/apiTypes";

dotenv.config();
const router = Router();

if (process.env.MODE === "development") {
  router.post("/registration", UserController.register);
}

router.get("/isAuth", UserController.authMiddleware, (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});
router.get(
  "/isAdmin",
  UserController.authMiddleware,
  UserController.adminMiddleware,
  (_, res) => {
    res.sendStatus(ResponseStatus.NO_CONTENT);
  }
);

router.post("/login", UserController.login);
router.post("/logout", UserController.authMiddleware, UserController.logout);

export default router;
