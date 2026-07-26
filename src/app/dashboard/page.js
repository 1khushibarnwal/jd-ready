import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome, {session.user.name}
          </h1>
          <p className="text-sm text-neutral-500">{session.user.email}</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        Resume upload &amp; JD analysis will live here next.
      </div>
    </div>
  );
}
