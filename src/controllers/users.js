import createHttpError from "http-errors";


import { addWaterAmound, setAvatar, updateUser } from "../services/users.js";

import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { UsersCollection } from "../db/models/users.js";


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

import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { updateUser } from "../services/users.js";
import { UsersCollection } from "../db/models/users.js";

export const patchUserController = async (req, res, next) => {
  const userId = req.user._id;
  const user = req.body;

  try {
    
    if (user.password && user.oldPassword) {
      
      const currentUser = await UsersCollection.findById(userId);

      if (!currentUser) {
        return next(createHttpError(404, "User not found"));
      }

     
      const isOldPasswordValid = await bcrypt.compare(user.oldPassword, currentUser.password);

      if (!isOldPasswordValid) {
        return next(createHttpError(400, "Old password is incorrect"));
      }

     
      const result = await updateUser({
        userId,
        user,
      });

      return res.json({
        status: 200,
        message: "Successfully updated user!",
        data: result.user,
      });
    }

   
    const result = await updateUser({
      userId,
      user,
    });

    if (!result) {
      return next(createHttpError(404, "User not found"));
    }

    res.json({
      status: 200,
      message: "Successfully updated user!",
      data: result.user,
    });
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

export const patchWaterAmount = async (req, res, next) => {
  const userId = req.user._id;
  const user = req.body;
  console.log("Water amount:", user);
  let waterAmount = user.waterAmount
  if ( waterAmount > 15){
    waterAmount = user.waterAmount / 1000
  }
console.log("Water amount:", user.waterAmount);
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