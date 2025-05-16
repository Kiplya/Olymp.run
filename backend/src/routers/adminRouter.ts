import { ResponseStatus } from "@shared/apiTypes";
import { Router } from "express";
import UserController from "../controllers/UserController";
import ContestController from "../controllers/ContestController";
import TaskController from "../controllers/TaskController";
import { upload } from "../handlers";

const adminRouter = Router();
adminRouter.use(UserController.authMiddleware);
adminRouter.use(UserController.adminMiddleware);

adminRouter.get("/isAdmin", (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});

adminRouter.post("/registration", UserController.register);
adminRouter.delete("/userDeleteByLogin", UserController.deleteByLogin);

adminRouter.post(
  "/taskCreate",
  upload.single("testsFile"),
  TaskController.create
);
adminRouter.delete("/taskDeleteByTitle", TaskController.deleteByTitle);
adminRouter.get("/taskGetByDiffAndTitle", TaskController.getByDiffAndTitle);
adminRouter.get("/taskGetByTitle", TaskController.getByTitle);

adminRouter.post("/contestCreate", ContestController.create);
adminRouter.delete("/contestDeleteByTitle", ContestController.deleteByTitle);
adminRouter.post("/contestAddParticipant", ContestController.addParticipant);
adminRouter.delete(
  "/contestRemoveParticipant",
  ContestController.removeParticipant
);

export default adminRouter;
