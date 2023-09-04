import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import Auth0Provider from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  pages: { signIn: '/auth/signin' },
    
  callbacks: {
    authorized({ req, token }: any) {
      if (token) return true; // If there is a token, the user is authenticated
    },
    async session({ session, user, token }: any) {
      return {
        ...session,
        user: {
          ...(session.user ?? {}),
          ...(user
            ? {
                id: user.id,
                role: user.role,
                theme: user.theme,
              }
            : {}),
        },
      };
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
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_CLIENT_ISSUER as string,
    }),
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
export const dynamic = 'force-dynamic';
