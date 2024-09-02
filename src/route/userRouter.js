import express from "express";
import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middleware/validateBody.js";

import { authenticate } from "../middleware/authenticate.js";
import { upload } from '../middleware/multer.js';


import { userSchema } from "../validation/user.js";
import { patchUserController } from "../controllers/users.js";

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.patch(
  "/avatarUser",
  jsonParser,
  validateBody(userSchema),
  upload.single("photo"),
  ctrlWrapper(patchUserController)
);
export default router;
