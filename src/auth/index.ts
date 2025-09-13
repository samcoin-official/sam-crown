import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    session: async ({ session, token }) => {
      return session;
    },
  },
});