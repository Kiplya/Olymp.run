import { Router } from "express";
import UserController from "./controllers/UserController";

const router = Router();

router.post("/registration", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.authMiddleware, UserController.logout);
router.get("/auth", UserController.checkAuth);

export default router;
