import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#1e1e1e]">TechDesk</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>
      <LoginForm />
    </div>
  );
}
