import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";

import { userSchema, userSchemaPatch } from "../validation/user.js";
import {
  patchUserAvatarController,
  patchUserController,
  getValidUser,
  patchWaterAmount,
} from "../controllers/users.js";

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.patch(
  "/avatar",
  jsonParser,
  upload.single("photo"),
  ctrlWrapper(patchUserAvatarController)
);

router.get("/userInfo", ctrlWrapper(getValidUser));

router.patch(
  "/",
  jsonParser,
  validateBody(userSchemaPatch),
  ctrlWrapper(patchUserController)
);
router.patch(
  "/waterAmount",
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(patchWaterAmount)
);
export default router;