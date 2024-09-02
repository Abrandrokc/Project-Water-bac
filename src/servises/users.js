import { UsersCollection } from "../db/models/users.js";

export const setAvatar = async (uploadPhoto) => {
  console.log(uploadPhoto);
  const updateData = { ...uploadPhoto.user };
  if (uploadPhoto.photo) {
    updateData.photo = uploadPhoto.photo;
  }

  const updateUser = await UsersCollection.findOneAndUpdate(
    { _id: uploadPhoto.userId },
    updateData,
    { new: true }
  );

  return {
    user: updateUser,
    isNew: Boolean(updateUser?.lastErrorObject?.upserted),
  };
};

export async function getUserById(userIdParam) {
  const userById = await UsersCollection.findOne({ _id: userIdParam});
  return userById;
}
