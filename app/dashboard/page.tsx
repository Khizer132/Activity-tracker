"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api";
import { StatsCards } from "@/components/admin/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

function formatRole(role: string) {
  return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const [name, setName] = useState<string>("User");
  const [role, setRole] = useState<string>("employee");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { user } = await getMe();
        if (!active) return;
        setName(user.name);
        setRole(user.role);
      } catch {
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <strong>{name}</strong>. You are signed in as{" "}
          {formatRole(role)}.
        </p>
      </div>

      <StatsCards />
      <RecentActivity />
    </div>
  );
}
