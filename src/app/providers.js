"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider>
        <NetworkStatusBanner />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
