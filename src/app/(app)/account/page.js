import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export default async function AccountPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">
        Account settings
      </h1>

      <div className="border border-border rounded-lg p-6 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-secondary mb-4">
          Profile
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-ink-secondary">Name</p>
            <p className="text-ink font-medium">{session.user.name}</p>
          </div>
          <div>
            <p className="text-ink-secondary">Email</p>
            <p className="text-ink font-medium">{session.user.email}</p>
          </div>
        </div>
      </div>

      <div className="border border-danger/30 rounded-lg p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-danger mb-2">
          Danger zone
        </h2>
        <p className="text-sm text-ink-secondary mb-4">
          Permanently delete your account, along with every resume, analysis,
          cover letter, and builder draft associated with it. This cannot be
          undone.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
