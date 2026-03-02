"use client";

import { useState, FormEvent } from "react";
import type { Ticket } from "@/types";
import { acceptTicket, submitTicketPullRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TicketStageControlsProps {
  ticket: Ticket;
  onTicketUpdated?: (ticket: Ticket) => void;
}

export function TicketStageControls({
  ticket,
  onTicketUpdated,
}: TicketStageControlsProps) {
  const [accepting, setAccepting] = useState(false);
  const [submittingPr, setSubmittingPr] = useState(false);
  const [prUrl, setPrUrl] = useState<string>(ticket.pullRequest?.url ?? "");
  const [prMessage, setPrMessage] = useState<string>(
    ticket.pullRequest?.message ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  const canAccept =
    ticket.status === "assigned" || ticket.status === "rejected";
  const canSubmitPr = ticket.status === "in_progress";
  const isPrSubmitted = ticket.status === "pr_submitted";

  const handleAccept = async () => {
    if (!canAccept || accepting) return;

    setError(null);
    setAccepting(true);
    try {
      const { ticket: updatedPartial } = await acceptTicket(ticket._id);

      const updated: Ticket = {
        ...ticket,
        status: updatedPartial.status,
        acceptedAt: updatedPartial.acceptedAt ?? null,
      };

      onTicketUpdated?.(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept this ticket."
      );
    } finally {
      setAccepting(false);
    }
  };

  const handleSubmitPr = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmitPr || submittingPr) return;

    if (!prUrl.trim() || !prMessage.trim()) {
      setError("Please provide both PR URL and a short message.");
      return;
    }

    setError(null);
    setSubmittingPr(true);
    try {
      const { ticket: updated } = await submitTicketPullRequest(
        ticket._id,
        prUrl.trim(),
        prMessage.trim()
      );

      onTicketUpdated?.(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit pull request."
      );
    } finally {
      setSubmittingPr(false);
    }
  };

  if (!canAccept && !canSubmitPr && !isPrSubmitted) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border border-green-100 bg-green-50/40 p-2 text-xs">
      {error && (
        <p className="text-[11px] text-red-600" role="alert">
          {error}
        </p>
      )}

      {canAccept && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-green-900">
            This ticket is assigned to you. Accept it to start working and begin
            the timer.
          </p>
          <Button
            type="button"
            size="sm"
            className="h-7 bg-[#00d800] px-3 text-[11px] hover:bg-[#00d800]/90"
            disabled={accepting}
            onClick={handleAccept}
          >
            {accepting ? "Accepting..." : "Accept & start"}
          </Button>
        </div>
      )}

      {canSubmitPr && (
        <form className="space-y-2" onSubmit={handleSubmitPr}>
          <p className="text-[11px] font-medium text-green-900">
            Submit your pull request to move this ticket to review.
          </p>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-green-800">
              PR URL
            </label>
            <Input
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/your-org/your-repo/pull/123"
              className="h-8 text-xs"
              disabled={submittingPr}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-green-800">
              Notes for reviewer
            </label>
            <Textarea
              value={prMessage}
              onChange={(e) => setPrMessage(e.target.value)}
              rows={2}
              className="text-xs"
              placeholder="What did you implement? Anything to watch out for?"
              disabled={submittingPr}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="h-7 bg-[#00d800] px-3 text-[11px] hover:bg-[#00d800]/90"
              disabled={submittingPr}
            >
              {submittingPr ? "Submitting..." : "Submit PR"}
            </Button>
          </div>
        </form>
      )}

      {isPrSubmitted && (
        <div className="flex flex-col gap-1 text-[11px] text-green-900">
          <p>PR submitted. Waiting for review from your team lead or admin.</p>
          {ticket.pullRequest?.url && (
            <a
              href={ticket.pullRequest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[11px] font-medium text-green-700 underline"
            >
              View PR
            </a>
          )}
        </div>
      )}
    </div>
  );
}
