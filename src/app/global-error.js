"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled root layout error:", error);
  }, [error]);

  // No access to Tailwind theme classes here — the root layout (which sets
  // up fonts/CSS) is exactly what may have crashed, so this stays minimal
  // and self-contained on purpose.
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "28rem", color: "#666" }}>
          JDReady hit an unexpected error loading the page. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "6px",
            background: "#1a1a1a",
            color: "#fff",
            padding: "0.6rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
