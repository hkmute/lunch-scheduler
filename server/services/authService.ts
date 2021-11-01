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
    decodeGoogleToken: async (authCode: string, os: 'Android' | 'iOS' | 'expo') => {
      const osConfig = {
        iOS: {
          client_id: process.env.IOS_GOOGLE_CLIENT_ID!,
          redirect_uri: process.env.IOS_REDIRECT_URI,
        },
        Android: {
          client_id: process.env.AN_GOOGLE_CLIENT_ID!,
          redirect_uri: process.env.AN_REDIRECT_URI,
        },
        expo: {
          client_id: process.env.EXPO_GOOGLE_CLIENT_ID!,
          client_secret: process.env.EXPO_GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.EXPO_REDIRECT_URI,
        },
      };
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          grant_type: 'authorization_code',
          ...osConfig[os],
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

    getUserInfoById: async (id: string) => {
      return await knex<User>('user').select('id', 'name', 'email').where('id', id).first();
    },

    getUserInfoByEmail: async (email: string) => {
      return await knex<User>('user').select().where('email', email).first();
    },

    createNewUser: async (user: { email: string; name: string }) => {
      return await knex<User>('user').insert(user);
    },
  });
}
