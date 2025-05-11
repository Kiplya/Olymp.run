import { Router } from "express";
import UserController from "../controllers/UserController";
import { ResponseStatus } from "@shared/apiTypes";

const authRouter = Router();
authRouter.use(UserController.authMiddleware);

authRouter.get("/isAuth", (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});

authRouter.post("/logout", UserController.logout);

export default authRouter;
