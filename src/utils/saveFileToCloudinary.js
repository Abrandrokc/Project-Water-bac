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

export async function saveFileToCloudinary(file, folder) {
  if (!file) {
    throw new Error("No file provided for upload");
  }
  try {
    console.log(`Uploading file ${file.path} to Cloudinary in folder ${folder}`);
    const response = await cloudinary.uploader.upload(file.path, {
      folder,
    });
    await fs.unlink(file.path); // Ensure file is deleted after upload
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    throw error;
  }
}

