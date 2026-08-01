import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-background">
      <Navbar user={{ name: session.user.name, email: session.user.email }} />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
