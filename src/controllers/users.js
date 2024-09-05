import createHttpError from "http-errors";

import { setAvatar, updateUser } from "../services/users.js";

import env from "../utils/env.js";

import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";

export const patchUserAvatarController = async (req, res, next) => {
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env("ENABLE_CLOUDINARY") === "true") {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await setAvatar({ userId, photo: photoUrl });
  
  if (!result) {
    next(createHttpError(404, "User not found"));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully updated user!`,
    data: result.user,
  });
};

export async function getValidUser(req, res, next) {
  const user = req.user;
  if (user === null) {
    return next(createHttpError(404, "User not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully found User!",
    data: user,
  });
}

export const patchUserController = async (req, res, next) => {
  const userId = req.user._id;
  const user = req.body;
  const result = await updateUser({
    userId,
    user,
  });

  if (!result) {
    next(createHttpError(404, "User not found"));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully updated user!`,
    data: result.user,
  });
};
