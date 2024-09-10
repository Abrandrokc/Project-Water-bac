import createHttpError from 'http-errors';

import { Session } from '../db/models/session.js';
import { UsersCollection } from '../db/models/users.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (typeof authHeader !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401));
  }
  req.user = user;

  next();
}