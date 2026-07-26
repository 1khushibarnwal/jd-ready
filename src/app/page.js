import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">JDReady</h1>
        <p className="text-neutral-500 mb-8">
          Match your resume against any job description, close the gaps, and
          download an ATS-friendly version — all in one place.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-neutral-300 text-sm font-medium px-5 py-2.5 hover:bg-neutral-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
