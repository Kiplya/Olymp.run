import { Router } from "express";
import UserController from "./controllers/UserController";
import { ResponseStatus } from "@shared/apiTypes";

const router = Router();

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

router.post("/registration", UserController.register); // Will be moved to admin
router.post("/login", UserController.login);
router.post("/logout", UserController.authMiddleware, UserController.logout);

export default router;
