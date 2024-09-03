import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";

import { userSchema } from "../validation/user.js";
import {
  patchUserAvatarController,
  patchUserController,
  getValidUser,
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

router.get("/infoCurrentUser", ctrlWrapper(getValidUser));

router.patch(
  "/updateUser",
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(patchUserController)
);

export default router;
