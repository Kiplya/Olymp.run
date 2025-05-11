import { Router } from "express";
import publicRouter from "./publicRouter";
import authRouter from "./authRouter";
import adminRouter from "./adminRouter";

const router = Router();

router.use("/public", publicRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);

export default router;
