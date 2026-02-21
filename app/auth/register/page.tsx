import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#1e1e1e]">TechDesk</h1>
        <p className="text-muted-foreground">Create your account to get started with Activity Tracker</p>
      </div>
      <RegisterForm />
    </div>
  );
}
