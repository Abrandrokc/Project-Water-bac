import createHttpError from "http-errors";

import { updateUser, getUserById } from "../servises/users.js";

import env from "../utils/env.js";

import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";

export async function getUserByIdController(req, res, next) {
  const { userIdParam } = req.params;
  const userId = req.user._id;
  const userById = await getUserById(userIdParam, userId);

  if (userById === null) {
    return next(createHttpError(404, "User not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully found User!",
    data: userById,
  });
}

export const patchUserController = async (req, res, next) => {
  const { userIdParam } = req.params;
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
