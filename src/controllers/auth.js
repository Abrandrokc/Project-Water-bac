import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";
import { REFRESH_TOKEN_TTL } from "../constants/index.js";
import { generateAuthUrl, getGoogleAccountFromCode } from '../utils/googleOAuth2.js';
import jwt from 'jsonwebtoken';


function setupSession(res, session) {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

// Крок 1: Перенаправлення на сторінку Google OAuth
export const getGoogleAuthUrl = (req, res) => {
  const url = generateAuthUrl();
  res.json({ url });
};

// Крок 2: Обробка callback від Google OAuth
export const googleAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    const googleUser = await getGoogleAccountFromCode(code);

    // Крок 3: Перевірка, чи існує користувач у базі даних, якщо ні, створити користувача
    let user = await UsersCollection.findOne({ email: googleUser.email });
    if (!user) {
      user = await UsersCollection.create({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.sub,
      });
    }

    // Крок 4: Генерація JWT токена для користувача
    const token = jwt.sign({ id: user._id }, env('JWT_SECRET'), { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);
  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken: session.accessToken },
  });
}

export async function refreshUserSessionController(req, res) {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);
  console.log(session);
  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  console.log("Cookies:", req.cookies);
  if (req.cookies.sessionId && req.cookies.refreshToken) {
    await logoutUser({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
  }
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
}

