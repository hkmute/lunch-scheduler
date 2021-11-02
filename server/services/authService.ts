import { Knex } from 'knex';
import { User } from './model';
import { OAuth2Client } from 'google-auth-library';

export function AuthService(knex: Knex) {
  return Object.freeze({
    decodeGoogleToken: async (idToken: string, os: 'Android' | 'iOS' | 'expo') => {
      try {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
          idToken,
          audience: [
            process.env.IOS_GOOGLE_CLIENT_ID!,
            process.env.AN_GOOGLE_CLIENT_ID!,
            process.env.EXPO_GOOGLE_CLIENT_ID!,
          ],
        });
        const payload = ticket.getPayload();
        return payload;
      } catch {
        return null;
      }
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
