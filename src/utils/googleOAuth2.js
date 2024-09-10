import { OAuth2Client } from 'google-auth-library';
import  env  from './env.js';

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_AUTH_REDIRECT_URI'),
});

export const generateAuthUrl = () => googleOAuthClient.generateAuthUrl({
  scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
});

export const getGoogleAccountFromCode = async (code) => {
  const { tokens } = await googleOAuthClient.getToken(code);
  const ticket = await googleOAuthClient.verifyIdToken({ idToken: tokens.id_token });
  return ticket.getPayload();
};
