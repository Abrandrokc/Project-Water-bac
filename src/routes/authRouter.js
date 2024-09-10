import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import {
  registerUserSchema,
  loginUserSchema,
  loginWithGoogleOAuthSchema,
} from "../validation/auth.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  getGoogleAuthUrl,
  googleAuthCallback 
} from "../controllers/auth.js";

const router = Router();
const jsonParser = express.json();

// Маршрут для генерації URL Google OAuth
router.get('/get-oauth-url', getGoogleAuthUrl);

// Маршрут для обробки callback від Google OAuth
router.get('/google/callback', googleAuthCallback);

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
