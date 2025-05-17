import { Router } from "express";
import UserController from "../controllers/UserController";
import ContestController from "../controllers/ContestController";
import { ResponseStatus } from "@shared/apiTypes";

const authRouter = Router();
authRouter.use(UserController.authMiddleware);

authRouter.get("/isAuth", (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});

authRouter.post("/logout", UserController.logout);
authRouter.get(
  "/contestGetManyByParticipant",
  ContestController.getManyByParticipant
);

export default authRouter;
