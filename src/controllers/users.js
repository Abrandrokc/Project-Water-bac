import createHttpError from "http-errors";


import { addWaterAmound, setAvatar, updateUser } from "../services/users.js";

import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";


export const patchUserAvatarController = async (req, res, next) => {
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    try {
      
        photoUrl = await saveFileToCloudinary(photo, "photo");
      
    } catch (error) {
      console.error("Error saving file:", error);
      return next(createHttpError(500, "Error uploading file"));
    }
  }

  const result = await setAvatar({ userId, photo: photoUrl });
  
  if (!result) {
    return next(createHttpError(404, "User not found"));
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
export const patchWaterAmount = async (req, res, next) => {
  const userId = req.user._id;
  const user = req.body;
  let waterAmount 
  if (user.gender === "male") {
    waterAmount = Math.round((user.weight * 0.04) + (user.time * 0.6))
  } else {
    waterAmount = Math.round((user.weight * 0.03) + (user.time * 0.4))
  }
  if (waterAmount > 1.5) {
    waterAmount=1.5
  }

  const result = await addWaterAmound({

    waterAmount,
    userId,
  });
  console.log(result.waterAmount)
  res.json({
    status: 200,
    message: `Successfully updated waterAmount!`,
    data: waterAmount,
  });
};