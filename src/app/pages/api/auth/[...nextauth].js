import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Send credentials to Strapi for authentication
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/auth/local`,
            {
              identifier: credentials.identifier,
              password: credentials.password
            }
          );

          const { jwt, user } = response.data;

          // Return the user and JWT for session management
          return { jwt, user };
        } catch (error) {
          console.error('Login failed:', error.response?.data);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add JWT from Strapi to token
      if (user) {
        token.jwt = user.jwt;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach Strapi JWT and user to the session
      session.jwt = token.jwt;
      session.user = token.user;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
});
