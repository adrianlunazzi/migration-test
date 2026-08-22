import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/backoffice/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isBackoffice = request.nextUrl.pathname.startsWith("/backoffice");
      const isLoginPage = request.nextUrl.pathname === "/backoffice/login";
      if (!isBackoffice || isLoginPage) return true;
      return auth?.user?.role === "ADMIN";
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tokenVersion = user.tokenVersion;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN";
      session.user.tokenVersion = token.tokenVersion as number;
      return session;
    },
  },
} satisfies NextAuthConfig;
