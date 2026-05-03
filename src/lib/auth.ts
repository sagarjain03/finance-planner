/**
 * NextAuth Configuration
 * Handles authentication with Credentials provider (email + password)
 */

import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await connectDB();

          // Find user and explicitly select password field
          const user = await User.findOne({ email: credentials.email }).select(
            '+password'
          );

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Compare passwords
          const passwordMatch = await compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error('Invalid email or password');
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? error.message
              : 'Authentication failed'
          );
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export const { handlers, auth } = NextAuth(config);
export const authConfig = config;
