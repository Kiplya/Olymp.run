import { Router } from "express";
import UserController from "../controllers/UserController";
import { ResponseStatus } from "@shared/apiTypes";

const adminRouter = Router();
adminRouter.use(UserController.authMiddleware);
adminRouter.use(UserController.adminMiddleware);

adminRouter.get("/isAdmin", (_, res) => {
  res.sendStatus(ResponseStatus.NO_CONTENT);
});

adminRouter.delete("/deleteUser", UserController.delete);
adminRouter.post("/registration", UserController.register);

export default adminRouter;
