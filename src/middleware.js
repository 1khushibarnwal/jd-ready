import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// This uses ONLY the edge-safe config (no bcrypt/mongoose), so it's fine to
// run on the Edge runtime. The `authorized` callback in auth.config.js does
// the actual redirect-if-not-logged-in logic.
export const { auth: middleware } = NextAuth(authConfig);
export default middleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/history/:path*",
    "/builder/:path*",
    "/cover-letter/:path*",
    "/compare/:path*",
  ],
};
