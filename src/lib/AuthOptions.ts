import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { LoginResponse, login, loginWithGoogle } from '@/lib/AuthenticationAPI';
import { api } from './api';
import axios from 'axios';

const AuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      // authorize: async (credentials) => {
      //   const [response, error] = await login(
      //     credentials?.email!,
      //     credentials?.password!
      //   );

      //   if (error) {
      //     throw new Error(error);
      //   }

      //   if (response?.data) {
      //     return {
      //       ...response.data.user,
      //       auth_token: response.data.token,
      //     };
      //   }

      //   return null;
      // },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password is missing.");
        }

        const [response, error] = await login(credentials.email, credentials.password);

        if (error) {
          if (error.includes("User not found")) {
            throw new Error("User not found. Please check your email.");
          }
          if (error.includes("Incorrect password")) {
            throw new Error("Incorrect password. Please try again.");
          }
          throw new Error("Uh oh! Something went wrong.");
        }
 
        if (response?.data) {
          const user = response.data.user;

          return {
            ...user,
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            auth_token: response.data.token,
            phone: user.phone ?? "",
          };
        }

        return null;
      }

    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/unauthenticated',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.auth_token = token.auth_token;
        session.user.name = token.first_name + ' ' + token.last_name;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.phone = token.phone;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && account.provider == 'google' && account.access_token) {
        const [response, error] = await loginWithGoogle(
          'google',
          account.access_token
        );

        if (error) {
          throw new Error(error);
        }

        if (response?.data) {
          const user = {
            ...response.data.user,
            first_name: response.data.user.first_name ?? '',
            last_name: response.data.user.last_name ?? '',
            auth_token: response.data.token,
            emailVerified: response.data.user.email_verified ?? null,
          };
        }

      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.auth_token = user.auth_token;
        token.first_name = user.first_name ?? '';
        token.last_name = user.last_name ?? '';
        token.phone = user.phone ?? '';
      }
      return token;
    },
  },
};

export default AuthOptions;
