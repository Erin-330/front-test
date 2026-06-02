import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const PROTECTED_ROUTES = ["/profile", "/dashboard"];
export const LOGIN_ROUTE = "/login";
export const POST_LOGIN_REDIRECT = "/profile";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: LOGIN_ROUTE,
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isOnProtected = PROTECTED_ROUTES.some((p) =>
        nextUrl.pathname.startsWith(p),
      );
      const isOnLogin = nextUrl.pathname.startsWith(LOGIN_ROUTE);

      if (isOnProtected && !isLoggedIn) {
        const url = new URL(LOGIN_ROUTE, nextUrl);
        url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
        return Response.redirect(url);
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL(POST_LOGIN_REDIRECT, nextUrl));
      }

      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.login && session.user) {
        (session.user as { login?: string }).login = token.login as string;
      }
      return session;
    },
  },
});
