import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/prima';
import bcrypt from 'bcrypt';

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  pages: { signIn: '/auth/signin' },
  callbacks: {
    authorized({ req, token }: any) {
      if (token) return true; // If there is a token, the user is authenticated
    },
    async session({ session, user, token }: any) {
      return session;
    },
    async jwt(token: any, user?: any) {
      if (user) {
        token = {
          name: user.name,
          email: user.email,
          id: user.id,
          image: null,
          // add other important data here
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Your Email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          if (
            user &&
            // Password hash matches
            bcrypt.compareSync(credentials?.password ?? '', user.password ?? '')
          ) {
            return user;
          }
          return null;
        } catch (error) {
          console.log({ error });
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
