import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const role = session.user.role ?? "employee";

  return (
    <div className="flex h-screen overflow-hidden bg-green-50/30">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          role={role}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}