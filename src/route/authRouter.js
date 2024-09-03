import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { registerUserSchema, loginUserSchema } from "../validation/auth.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
} from "../controllers/auth.js";

const router = Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

router.post(
  "/login",
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

router.post("/logout", ctrlWrapper(logoutUserController));

export default router;
