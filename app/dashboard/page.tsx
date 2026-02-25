import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatRole(role: string) {
  return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? "User";
  const role = session?.user?.role ?? "employee";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <strong>{name}</strong>. You are signed in as {formatRole(role)}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-green-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">{formatRole(role)}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">Active</p>
          </CardContent>
        </Card>
        {/* <Card className="border-green-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the sidebar to open Projects or Tickets.
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* <Card className="border-green-200 bg-white">
        <CardHeader>
          <CardTitle className="text-green-800">Getting started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>Admins can create projects and tickets and manage users.</li>
            <li>Team leads can manage assigned projects and assign tickets.</li>
            <li>Employees can view assigned tickets, accept tasks, and submit PRs.</li>
          </ul>
        </CardContent>
      </Card> */}
    </div>
  );
}
