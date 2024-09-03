import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/multer.js";

import { userSchema } from "../validation/user.js";
import {
  putUserController,
  patchUserController,
  getValidUser,
} from "../controllers/users.js";

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.put(
  "/avatar",
  jsonParser,
  upload.single("photo"),
  ctrlWrapper(putUserController)
);

router.get("/validUser", ctrlWrapper(getValidUser));

router.patch(
  "/updateUser",
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(patchUserController)
);

export default router;
