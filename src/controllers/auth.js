import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";
import { REFRESH_TOKEN_TTL } from "../constants/index.js";
import { getGoogleAccountFromCode, googleOAuthClient  } from '../utils/googleOAuth2.js';
import jwt from 'jsonwebtoken';
import { UsersCollection } from "../db/models/users.js";
import env from "../utils/env.js";

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
export const getGoogleAuthUrl = async (req, res, next) => {
  try {
    const url = googleOAuthClient.generateAuthUrl({
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    });
    res.json({ url });
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) throw createHttpError(400, 'Code not provided');

    const payload = await getGoogleAccountFromCode(code);
    let user = await UsersCollection.findOne({ email: payload.email });

    if (!user) {
      const password = await bcrypt.hash(randomBytes(10), 10);
      user = await UsersCollection.create({
        email: payload.email,
        name: payload.name,
        password,
      });
    }

    await Session.deleteOne({ userId: user._id });
    const newSession = createSession();
    const session = await Session.create({
      userId: user._id,
      ...newSession,
    });

    res.json({ accessToken: session.accessToken, refreshToken: session.refreshToken });
  } catch (error) {
    next(error);
  }
};

export const loginOrSignupWithGoogle = async (req, res, next) => {
  const { code } = req.body;
  try {
    const loginTicket = await googleOAuthClient.getToken(code);
    const payload = loginTicket.getPayload();
    if (!payload) throw createHttpError(401);

    let user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
      const password = await bcrypt.hash(randomBytes(10).toString('hex'), 10);
      user = await UsersCollection.create({
        email: payload.email,
        name: payload.name,
        password,
      });
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = createSession();
    const session = await Session.create({
      userId: user._id,
      ...newSession,
    });

    res.json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
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

