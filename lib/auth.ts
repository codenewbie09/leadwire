import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { authUsers, authAccounts, authSessions, authVerificationTokens } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: authUsers,
    accountsTable: authAccounts,
    sessionsTable: authSessions,
    verificationTokensTable: authVerificationTokens,
  }),
  providers: [
    Google,
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const suffix = Math.random().toString(36).slice(2, 8);
        return {
          name: `Guest-${suffix}`,
          email: `guest-${suffix}@pitchperfect.local`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnSession = nextUrl.pathname.startsWith("/session");
      const isOnApi = nextUrl.pathname.startsWith("/api") && !nextUrl.pathname.startsWith("/api/auth");
      if (isOnDashboard || isOnSession || isOnApi) {
        return isLoggedIn;
      }
      return true;
    },
  },
});
