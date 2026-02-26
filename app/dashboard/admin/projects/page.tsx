"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/types";
import { getMe } from "@/lib/api";
import { RoleGuard } from "@/components/shared/RoleGuard";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminProjectsPage() {
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
        <h1 className="text-2xl font-bold text-green-800">Projects (admin)</h1>
        <Card className="border-green-200 bg-white">
          <CardHeader>
            <CardTitle>Manage projects</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Use the main{" "}
              <Link
                href="/dashboard/projects"
                className="text-green-700 underline-offset-2 hover:underline"
              >
                Projects
              </Link>{" "}
              view to create and inspect projects.
            </p>
            <p>This route simply exists as an admin entry point.</p>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
} 
