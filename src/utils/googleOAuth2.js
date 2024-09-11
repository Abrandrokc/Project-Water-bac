import { OAuth2Client } from 'google-auth-library';
import  env  from './env.js';

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_AUTH_REDIRECT_URI'),
});

export function generateAuthUrl() {
  const scopes = ['profile', 'email'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

// Функція для перевірки коду авторизації
export const getGoogleAccountFromCode = async (code) => {
  const { tokens } = await googleOAuthClient.getToken(code);
  googleOAuthClient.setCredentials(tokens);
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
};

export { googleOAuthClient };
  

