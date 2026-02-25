import { auth } from "@/lib/auth";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;

  return (

    <RoleGuard allowedRoles={["admin"]} userRole={role}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-green-800">Admin</h1>
        <Card className="border-green-200 bg-white">
          <CardHeader>
            <CardTitle>Users and projects</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Admin-only content
          </CardContent>
        </Card>
      </div>
    </RoleGuard>


  );
}