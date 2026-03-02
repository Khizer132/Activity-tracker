"use client";

import { useMemo, useState } from "react";
import type { Project, Ticket } from "@/types";
import { assignTicket } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignTicketControlProps {
  ticket: Ticket;
  project: Project;
  onTicketUpdated?: (ticket: Ticket) => void;
}

export function AssignTicketControl({
  ticket,
  project,
  onTicketUpdated,
}: AssignTicketControlProps) {
  const [assigning, setAssigning] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    ticket.assignedTo?._id ?? ""
  );

  const members = useMemo(() => {
    const list: { _id: string; name: string; role: string }[] = [];

    if (project.assignedTeamLead?._id) {
      list.push({
        _id: project.assignedTeamLead._id,
        name: project.assignedTeamLead.name,
        role: "team_lead",
      });
    }

    for (const emp of project.assignedEmployees || []) {
      if (!list.find((m) => m._id === emp._id)) {
        list.push({
          _id: emp._id,
          name: emp.name,
          role: emp.role,
        });
      }
    }

    return list;
  }, [project]);

  const handleAssign = async () => {
    if (!selectedUserId) {
    //   toast({
    //     title: "Select a member",
    //     description: "Please choose who should own this ticket.",
    //   });
      return;
    }

    setAssigning(true);
    try {
      const { ticket: updated, message } = await assignTicket(
        ticket._id,
        selectedUserId
      );

    //   toast({
    //     title: "Ticket assigned",
    //     description: message,
    //   });

      onTicketUpdated?.(updated);
    } catch (err) {
      console.error(err);
    //   toast({
    //     title: "Failed to assign ticket",
    //     description:
    //       err instanceof Error ? err.message : "Something went wrong.",
    //   });
    } finally {
      setAssigning(false);
    }
  };

  if (members.length === 0) {
    return (
      <p className="text-[11px] text-muted-foreground">
        No members are assigned to this project yet. Assign members first, then
        assign tickets.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-green-100 bg-green-50/40 p-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <span className="text-[11px] font-medium text-green-800">
          Assign to:
        </span>
        <Select
          value={selectedUserId}
          onValueChange={setSelectedUserId}
          disabled={assigning}
        >
          <SelectTrigger className="h-8 w-full max-w-xs text-xs">
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m._id} value={m._id}>
                {m.name} – {m.role.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        size="sm"
        className="h-8 w-full md:w-auto bg-[#00d800] hover:bg-[#00d800]/90"
        disabled={assigning}
        onClick={handleAssign}
      >
        {assigning ? "Assigning..." : "Save assignee"}
      </Button>
    </div>
  );
}
