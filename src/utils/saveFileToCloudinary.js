import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

import env from "../utils/env.js";
import { CLOUDINARY } from "../constants/index.js";

cloudinary.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export async function saveFileToCloudinary(file) {
  console.log(file.filename);
  if (!file) {
    throw new Error("No file provided for upload");
  }
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
}
