import { UsersCollection } from "../db/models/users.js";
import bcrypt from "bcrypt";

export const setAvatar = async (uploadPhoto) => {
  console.log(uploadPhoto)
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
  console.log(payload);
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
  console.log(updateUser);
  return {
    user: updateUser,
    isNew: Boolean(updateUser?.lastErrorObject?.upserted),
  };
};
