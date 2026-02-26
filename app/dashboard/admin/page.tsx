"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/types";
import { getMe } from "@/lib/api";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  const [role, setRole] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { user } = await getMe();
        if (!active) return;
        setRole(user.role);
      } catch {
        setRole(undefined);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <RoleGuard allowedRoles={["admin"]} userRole={role}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-green-800">User management</h1>
        <p className="text-muted-foreground">
          View users, change roles, and deactivate accounts.
        </p>
        <UserTable />
      </div>
    </RoleGuard>
  );
}
