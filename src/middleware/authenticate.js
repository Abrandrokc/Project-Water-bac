import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import { Session } from '../db/models/session.js';
import { UsersCollection } from '../db/models/users.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (typeof authHeader !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  // Find the session using the token
  const session = await Session.findOne({ accessToken: token });
  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  // Check if the access token has expired
  const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // Verify the token and find the user
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));
    const user = await UsersCollection.findById(decoded.id);
    if (user === null) {
      return next(createHttpError(401, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, 'Token is not valid'));
  }
}