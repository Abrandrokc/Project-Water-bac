import path from "node:path";
import fs from 'fs';
export const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

export const TEMP_UPLOAD_DIR = path.resolve("srs","temp");

export const UPLOAD_DIR = path.resolve("srs","uploads");
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}
export const CLOUDINARY = {
  CLOUD_NAME: "CLOUDINARY_CLOUD_NAME",
  API_KEY: "CLOUDINARY_API_KEY",
  API_SECRET: "CLOUDINARY_API_SECRET",
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const en = ["man","woman"]