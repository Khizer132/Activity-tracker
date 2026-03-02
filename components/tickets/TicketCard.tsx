import type { Ticket, TicketPriority, TicketStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  showProjectName?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
}

function priorityVariant(priority: TicketPriority): string {
  switch (priority) {
    case "low":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "medium":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "high":
      return "bg-orange-50 text-orange-800 border-orange-200";
    case "critical":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

function statusVariant(status: TicketStatus): string {
  switch (status) {
    case "open":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "assigned":
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "in_progress":
      return "bg-green-100 text-green-800 border-green-200";
    case "pr_submitted":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "completed":
      return "bg-emerald-100 text-emerald-900 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

export function TicketCard({
  ticket,
  showProjectName,
  canDelete,
  onDelete,
}: TicketCardProps) {
  const projectName =
    typeof ticket.project === "string"
      ? undefined
      : ticket.project.name ?? "Unknown";

  const assigneeName = ticket.assignedTo?.name;
  const assigneeRole = ticket.assignedTo?.role;
  const showDelete = Boolean(canDelete && onDelete);

  return (
    <Card className="border-green-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-start justify-between gap-2 text-sm font-semibold text-green-800">
          <span className="line-clamp-2 flex-1">{ticket.title}</span>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Badge
              variant="outline"
              className={`capitalize border ${statusVariant(ticket.status)}`}
            >
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={`capitalize border ${priorityVariant(ticket.priority)}`}
            >
              {ticket.priority}
            </Badge>
            {showDelete && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-6 w-6 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        {showProjectName && projectName && (
          <p className="font-medium text-green-800">
            Project:{" "}
            <span className="font-normal text-muted-foreground">
              {projectName}
            </span>
          </p>
        )}

        {assigneeName ? (
          <p className="text-xs">
            Assigned to:{" "}
            <span className="font-medium text-green-800">
              {assigneeName}
            </span>
            {assigneeRole && (
              <span className="text-[11px] text-muted-foreground">
                {" "}
                ({assigneeRole.replace("_", " ")})
              </span>
            )}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            Not yet assigned to any member.
          </p>
        )}

        <p className="line-clamp-3">
          {ticket.description || "No description."}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Created:{" "}
            <span className="font-medium">
              {formatDateTime(ticket.createdAt)}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}