import { Knex } from 'knex';
import fetch from 'node-fetch';
import { User } from './model';

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export function AuthService(knex: Knex) {
  return Object.freeze({
    decodeGoogleToken: async (authCode: string) => {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          client_id: process.env.EXPO_GOOGLE_CLIENT_ID!,
          client_secret: process.env.EXPO_GOOGLE_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: process.env.EXPO_REDIRECT_URI,
        }),
      });
      const resJson = await res.json();
      const accessCode = resJson.access_token;
      const fetchUserInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessCode}`,
        },
      });
      const userInfo = await fetchUserInfo.json();
      return userInfo as GoogleUserInfo;
    },

    getUserInfo: async (email: string) => {
      return await knex<User>('user').select().where('email', email).first();
    },

    createNewUser: async (user: { email: string; name: string }) => {
      return await knex<User>('user').insert(user);
    },
  });
}
