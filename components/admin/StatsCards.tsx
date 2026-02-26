"use client";

import { useEffect, useState } from "react";
import { Users, FolderKanban, Ticket, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { getUsers, getProjects, getTickets } from "@/lib/api";
import type { Ticket as TicketType } from "@/types";

interface StatsState {
  users: number;
  projects: number;
  tickets: number;
  completedTickets: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError(null);
        const [usersRes, projectsRes, ticketsRes] = await Promise.all([
          getUsers(),
          getProjects(),
          getTickets(),
        ]);
        if (!active) return;

        const completedTickets = ticketsRes.tickets.filter(
          (t: TicketType) => t.status === "completed"
        ).length;

        setStats({
          users: usersRes.count,
          projects: projectsRes.count,
          tickets: ticketsRes.count,
          completedTickets,
        });
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load statistics."
        );
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!stats && !error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 bg-white">
          <CardContent className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="py-4 text-sm text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const completionRate =
    stats.tickets === 0
      ? 0
      : Math.round((stats.completedTickets / stats.tickets) * 100);

  const items = [
    { label: "Total users", value: stats.users, icon: Users },
    { label: "Projects", value: stats.projects, icon: FolderKanban },
    { label: "Tickets", value: stats.tickets, icon: Ticket },
    {
      label: "Completion rate",
      value: completionRate,
      icon: CheckCircle2,
      suffix: "%",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-green-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">
              {item.value}
              {item.suffix}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}