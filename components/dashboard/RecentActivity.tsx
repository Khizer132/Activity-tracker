"use client";

import { useEffect, useState } from "react";
import type { Project, Ticket } from "@/types";
import { getProjects, getTickets } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface ActivityItem {
  id: string;
  type: "project" | "ticket";
  title: string;
  subtitle: string;
  createdAt?: string;
}

export function RecentActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [projectsRes, ticketsRes] = await Promise.all([
          getProjects(),
          getTickets(),
        ]);
        if (!active) return;

        const projectItems: ActivityItem[] = projectsRes.projects
          .slice(0, 10)
          .map((project: Project) => ({
            id: project._id,
            type: "project",
            title: project.name,
            subtitle: `Project • Status: ${project.status}`,
            createdAt: project.createdAt,
          }));

        const ticketItems: ActivityItem[] = ticketsRes.tickets
          .slice(0, 20)
          .map((ticket: Ticket) => ({
            id: ticket._id,
            type: "ticket",
            title: ticket.title,
            subtitle: `Ticket • ${
              typeof ticket.project === "string"
                ? "Unknown project"
                : ticket.project.name
            }`,
            createdAt: ticket.createdAt,
          }));

        const merged = [...projectItems, ...ticketItems].sort((a, b) => {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bd - ad;
        });

        setItems(merged.slice(0, 8));
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load activity."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card className="border-green-200 bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-green-800">
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {loading && (
          <div className="flex items-center gap-2">
            <LoadingSpinner className="size-4" />
            <span className="text-muted-foreground">Loading activity...</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No recent activity yet. Create projects and tickets to see updates
            here.
          </p>
        )}
        {!loading &&
          !error &&
          items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex flex-col rounded-md bg-green-50/60 px-3 py-2"
            >
              <span className="font-medium text-green-800">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.subtitle}
              </span>
              <span className="text-[11px] text-muted-foreground/70">
                {formatDateTime(item.createdAt)}
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}