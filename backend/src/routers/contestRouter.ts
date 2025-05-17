import { Router } from "express";
import UserController from "../controllers/UserController";
import ContestController from "../controllers/ContestController";

const contestRouter = Router();
contestRouter.use(UserController.authMiddleware);
contestRouter.use(ContestController.participationMiddleware);

contestRouter.get("/getInfo", ContestController.getInfo);

export default contestRouter;
