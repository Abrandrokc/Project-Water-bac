import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";
import { generateAuthUrl } from "../utils/googleOAuth2.js"
import env from "../utils/env.js"

import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/auth.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  getGoogleAuthUrl,
  googleAuthCallback,
  loginOrSignupWithGoogle
} from "../controllers/auth.js";

const router = Router();
const jsonParser = express.json();

// Маршрут для генерації URL Google OAuth
// router.get('/get-oauth-url', getGoogleAuthUrl);
// router.post('/auth/google-login', loginOrSignupWithGoogle);
// router.post('/auth/login', jsonParser, validateBody(loginUserSchema), ctrlWrapper(loginUserController));
// router.post('/auth/register', jsonParser, validateBody(registerUserSchema), ctrlWrapper(registerUserController));
// router.post('/auth/refresh', ctrlWrapper(refreshUserSessionController));
// router.post('/auth/logout', ctrlWrapper(logoutUserController));
// router.get('/google/callback', googleAuthCallback);
// router.get('/google', (req, res) => {
//   const authUrl = generateAuthUrl();
//   res.json({ url: authUrl });
// });

const client_id = env("GOOGLE_AUTH_CLIENT_ID");
const redirect_uri = env("GOOGLE_AUTH_REDIRECT_URI");
const scope = 'email profile';
const response_type = 'code';
const access_type = 'offline';
const include_granted_scopes = 'true';

router.get('/auth/google', (req, res) => {
  const authURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${client_id}&` +
    `redirect_uri=${redirect_uri}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=${response_type}&` +
    `access_type=${access_type}&` +
    `include_granted_scopes=${include_granted_scopes}`;
    
  res.redirect(authURL);
});
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
