import { Router } from "express";

import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import waterRouters from "./waterRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/water", waterRouters);
export default router;
