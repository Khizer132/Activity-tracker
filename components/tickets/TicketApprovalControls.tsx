"use client";

import { useState } from "react";
import type { Ticket } from "@/types";
import { completeTicket, rejectTicket } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface TicketApprovalControlsProps {
  ticket: Ticket;
  onTicketUpdated?: (ticket: Ticket) => void;
}

export function TicketApprovalControls({
  ticket,
  onTicketUpdated,
}: TicketApprovalControlsProps) {
  const [completing, setCompleting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setError(null);
    setCompleting(true);
    try {
      const { ticket: updated } = await completeTicket(ticket._id);
      onTicketUpdated?.({ ...ticket, ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve.");
    } finally {
      setCompleting(false);
    }
  };

  const handleReject = async () => {
    setError(null);
    setRejecting(true);
    try {
      const { ticket: updated } = await rejectTicket(ticket._id);
      onTicketUpdated?.({ ...ticket, ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject.");
    } finally {
      setRejecting(false);
    }
  };

  if (ticket.status !== "pr_submitted") return null;

  return (
    <div className="space-y-2 text-xs">
      <p className="text-[11px] text-green-900">PR is awaiting your approval.</p>

      {ticket.pullRequest?.url && (
        <a
          href={ticket.pullRequest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-green-700 underline"
        >
          View PR
        </a>
      )}

      {error && <p className="text-[11px] text-red-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          className="h-7 bg-[#00d800] px-3 text-[11px] text-white hover:bg-[#00d800]/90"
          disabled={completing || rejecting}
          onClick={handleApprove}
        >
          {completing ? "Approving..." : "Approve"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 border-red-200 text-red-700 text-[11px] hover:bg-red-50 hover:text-red-800 px-3"
          disabled={completing || rejecting}
          onClick={handleReject}
        >
          {rejecting ? "Rejecting..." : "Reject"}
        </Button>
      </div>
    </div>
  );
}