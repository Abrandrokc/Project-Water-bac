import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { registerUserSchema } from "../validation/auth.js";
import { registerUserController } from "../controlers/auth.js";

const router = Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

export default router;
