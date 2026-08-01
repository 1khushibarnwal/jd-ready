// This config is intentionally free of Node-only imports (no mongoose, no bcrypt)
// because it gets imported by middleware.js, which runs on the Edge runtime.
// The full config (with the Credentials provider) lives in auth.js instead.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/history") ||
        nextUrl.pathname.startsWith("/builder") ||
        nextUrl.pathname.startsWith("/cover-letter") ||
        nextUrl.pathname.startsWith("/compare") ||
        nextUrl.pathname.startsWith("/account");

      if (isProtectedRoute) {
        return isLoggedIn; // false triggers an automatic redirect to `pages.signIn`
      }

      return true;
    },
  },
  providers: [], // filled in by auth.js — kept empty here so this file stays Edge-safe
};
