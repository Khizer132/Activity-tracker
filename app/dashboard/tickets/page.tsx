"use client";

import { useEffect, useState } from "react";
import type { Ticket, TicketStatus } from "@/types";
import { getTickets } from "@/lib/api";
import { TicketCard } from "@/components/tickets/TicketCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const statusOrder: TicketStatus[] = [
  "open",
  "assigned",
  "in_progress",
  "pr_submitted",
  "completed",
  "rejected",
];

const statusLabel: Record<TicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In progress",
  pr_submitted: "PR submitted",
  completed: "Completed",
  rejected: "Rejected",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getTickets();
        if (!active) return;
        setTickets(res.tickets);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load tickets."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner className="mt-8 items-center justify-center" />;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  const grouped = statusOrder.map((status) => ({
    status,
    tickets: tickets.filter((t) => t.status === status),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-800">Tickets</h1>
        <p className="text-muted-foreground">
          All tickets you can see, grouped by status.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {grouped.map(({ status, tickets }) => (
          <div
            key={status}
            className="space-y-3 rounded-lg border border-green-200 bg-white p-4"
          >
            <h2 className="text-sm font-semibold text-green-800">
              {statusLabel[status]} ({tickets.length})
            </h2>
            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No tickets in this column.
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    showProjectName
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
