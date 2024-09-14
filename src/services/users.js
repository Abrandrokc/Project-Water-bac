import { UsersCollection } from "../db/models/users.js";
import bcrypt from "bcrypt";

export const setAvatar = async (uploadPhoto) => {
  const updateData = {};

  if (uploadPhoto.photo) {
    updateData.photo = uploadPhoto.photo;
  }

  const updateUser = await UsersCollection.findOneAndUpdate(
    { _id: uploadPhoto.userId },
    { $set: updateData },
    { new: true }
  );
  return {
    user: updateUser,
    isNew: Boolean(updateUser?.lastErrorObject?.upserted),
  };
};

export const updateUser = async (payload) => {
  const updateData = { ...payload.user };

  
  if (payload.user.password) {
    const encryptedPassword = await bcrypt.hash(payload.user.password, 10);
    updateData.password = encryptedPassword;
  }

 
  const updateUser = await UsersCollection.findOneAndUpdate(
    { _id: payload.userId },
    { $set: updateData },
    { new: true }
  );

  return {
    user: updateUser,
    isNew: Boolean(updateUser?.lastErrorObject?.upserted),
  };
};

export const addWaterAmound = async (payload) => {
  const { userId, waterAmount } = payload;

  try {
    const updateData = { waterAmount };
    console.log(updateData)
    const updateUser = await UsersCollection.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );
    
    if (!updateUser) {
      throw new Error("User not found");
    }

    return {
      user: updateUser,
      isNew: Boolean(updateUser?.lastErrorObject?.upserted),
    };
  } catch (error) {
    console.error("Error updating water amount:", error);
    throw new Error("Database update failed");
  }
};