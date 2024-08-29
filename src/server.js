// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
// import router from './routers/index.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { UPLOAD_DIR } from './constants/index.js';
// import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));

// Дозволені домени, з яких можна робити запити
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  '',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export const setupServer = () => {
  const app = express();

  // Налаштування CORS
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  );

  app.get('/', (req, res) => {
    res.status(200).json({
      message: "Welcome to the Aquatrack API!",
    });
  });

  // app.use(router);

  // app.use('*', notFoundHandler);
  // app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
    // Додаємо підтримку preflight запитів
  app.options('*', cors(corsOptions));
};
