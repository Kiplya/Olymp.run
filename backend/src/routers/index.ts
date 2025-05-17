import { Router } from "express";
import publicRouter from "./publicRouter";
import authRouter from "./authRouter";
import adminRouter from "./adminRouter";
import contestRouter from "./contestRouter";

const router = Router();

router.use("/public", publicRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/contest", contestRouter);

export default router;
