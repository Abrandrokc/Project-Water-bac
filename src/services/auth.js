import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import randomBytes from "randombytes";

import { UsersCollection } from "../db/models/users.js";
import { Session } from "../db/models/session.js";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../constants/index.js";

function createSession() {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
}

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
}

export async function loginUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, "User not found");
  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw createHttpError(401, "Unauthorized");
  await Session.deleteOne({ userId: user._id });
  const newSession = createSession();
  return await Session.create({
    userId: user._id,
    ...newSession,
  });
}

export async function refreshUsersSession({ sessionId, refreshToken }) {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
}

export async function logoutUser({ sessionId, refreshToken }) {
    await Session.deleteOne({ _id: sessionId, refreshToken });
  }