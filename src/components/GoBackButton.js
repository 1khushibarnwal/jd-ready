"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-sm font-medium text-ink-secondary underline hover:text-ink"
    >
      Go back
    </button>
  );
}
