import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  // ✅ Named export
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/auth/local`,
            {
              identifier: credentials.identifier,
              password: credentials.password
            }
          );

          const { jwt, user } = response.data;
          if (!jwt || !user) throw new Error('Invalid credentials');

          return { jwt, ...user };
        } catch (error) {
          console.error('Login failed:', error.response?.data);
          throw new Error('Invalid login credentials');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt; // ✅ Store JWT
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role_type = user.role_type;
        token.documentId = user.documentId;
      }
      console.log('🔥 JWT Callback - token OUT ' + JSON.stringify(token));
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt; // ✅ Attach JWT to session
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        firstname: token.firstName,
        lastname: token.lastName,
        role_type: token.role_type,
        documentId: token.documentId
      };
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure this exists in .env
  pages: {
    signIn: '/sign-in'
  },
  debug: process.env.NODE_ENV === 'development'
};
