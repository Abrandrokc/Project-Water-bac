import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import  env  from '../utils/env.js';
import { UsersCollection } from '../db/models/users.js';
import { googleOAuthClient }  from '../utils/googleOAuth2.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  try {
    // Перевірка Google OAuth токену
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: token,
      audience: env('GOOGLE_AUTH_CLIENT_ID'),
    });
    
    const payload = ticket.getPayload();
    let user = await UsersCollection.findOne({ email: payload.email });

    if (!user) {
      user = await UsersCollection.create({
        googleId: payload.sub,
        email: payload.email,
        photo: payload.picture,
        name: payload.name,
        password: '',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Перевірка JWT-токену
    try {
      const decoded = jwt.verify(token, env('JWT_SECRET'));
      const user = await UsersCollection.findById(decoded.id);
      if (!user) {
        return next(createHttpError(404, 'User not found'));
      }
      req.user = user;
      next();
    } catch (err) {
      next(createHttpError(401, 'Unauthorized'));
    }
  }
}
