import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import env from "./utils/env.js";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

import { UPLOAD_DIR } from "./constants/index.js";

import { swaggerDocs } from "./middleware/swaggerDocs.js";
import swaggerUI from "swagger-ui-express";

export default function setupServer() {
  dotenv.config();
  const port = env("PORT", "3000");

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );
  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use("/api-docs", swaggerUI.serve, swaggerDocs());
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(port, () => console.log(`Server is running on port ${port} `));
}
