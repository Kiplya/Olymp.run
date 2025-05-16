import { Router } from "express";
import UserController from "../controllers/UserController";
import { ResponseStatus } from "@shared/apiTypes";
import ContestController from "src/controllers/ContestController";

const authRouter = Router();
authRouter.use(UserController.authMiddleware);

authRouter.get("/isAuth", (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});

authRouter.post("/logout", UserController.logout);
authRouter.get("/contestGetByParticipant", ContestController.getByParticipant);

export default authRouter;
