import express from "express";

import cookieParser from "cookie-parser";

import waterRouters from "./routes/waterRoute.js";
import authRoutes from "./routes/authRouter.js"

import { UPLOAD_DIR } from "./constants/index.js";

import cors from 'cors';
import pino from 'pino-http';
import dotenv from "dotenv";
import env from "./utils/env.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";


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
  //===========================================================
  app.get('/auth/google/callback', async (req, res) => {
      const code = req.query.code;
      if (!code) {
          return res.status(400).send('No code provided');
      }

      try {
          const response = await axios.post('https://oauth2.googleapis.com/token', null, {
              params: {
                  code: code,
                  client_id: 'YOUR_CLIENT_ID',
                  client_secret: 'YOUR_CLIENT_SECRET',
                  redirect_uri: 'https://water-tracker-project-8.vercel.app/auth/google/callback',
                  grant_type: 'authorization_code',
              },
          });

          const { access_token } = response.data;
          // Виклик функції для отримання даних користувача
          await getUserInfo(access_token, res);
      } catch (error) {
          console.error('Error exchanging code for token:', error);
          res.status(500).send('Error');
      }
  });

  // Функція для отримання даних користувача
  const getUserInfo = async (accessToken, res) => {
      try {
          const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });

          const userData = response.data;

          // Збереження даних користувача в базу даних
          await saveUserData(userData);

          // Перенаправлення на ваш фронтенд
          res.redirect('https://water-tracker-project-8.vercel.app/home');
      } catch (error) {
          console.error('Error fetching user info:', error);
          res.status(500).send('Error');
      }
  };

  // Функція для збереження даних користувача
  const saveUserData = async (userData) => {
      // Реалізуйте збереження даних користувача в базу даних
      console.log('Saving user data:', userData);
      // Наприклад: await User.create(userData);
  };
  //===========================================================
  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use("/api-docs", swaggerUI.serve, swaggerDocs());
  app.use('/auth', authRoutes); 
  app.get('/api/auth/google', (req, res) => {
  // Генеруйте URL для Google авторизації
  const googleAuthUrl = '';
  res.json({ url: googleAuthUrl });
});
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(port, () => console.log(`Server is running on port ${port} `));
}



