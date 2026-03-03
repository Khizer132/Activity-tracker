
"use client";

import { useEffect, useState } from "react";
import type { Project, User } from "@/types";
import { getUsers, assignMemberToProject, getProjectById } from "@/lib/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AssignMemberFormProps {
  projectId: string;
  onProjectUpdated: (project: Project) => void;
}

export function AssignMemberForm({ projectId, onProjectUpdated }: AssignMemberFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [assigningLead, setAssigningLead] = useState(false);
  const [assigningEmployee, setAssigningEmployee] = useState(false);

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getUsers(); // admin-only endpoint
        if (!active) return;
        setUsers(res.users);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoadingUsers(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const teamLeads = users.filter((u) => u.role === "team_lead");
  const employees = users.filter((u) => u.role === "employee");

  const refreshProject = async () => {
    const { project } = await getProjectById(projectId);
    onProjectUpdated?.(project);
  };

  const handleAssignLead = async () => {
    if (!selectedLeadId || assigningLead) return;
    setAssigningLead(true);
    try {
      await assignMemberToProject(projectId, selectedLeadId, "team_lead");
      await refreshProject();
      setSelectedLeadId("");
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningLead(false);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployeeId || assigningEmployee) return;
    setAssigningEmployee(true);
    try {
      await assignMemberToProject(projectId, selectedEmployeeId, "employee");
      await refreshProject();
      setSelectedEmployeeId("");
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningEmployee(false);
    }
  };

  if (loadingUsers) {
    return <p className="text-xs text-muted-foreground">Loading assignable members...</p>;
  }

  return (
    <div className="space-y-3 rounded-lg border border-green-100 bg-green-50/40 p-3">
      <p className="text-xs font-semibold text-green-800">Assign members to this project</p>

      {/* Team lead dropdown */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <div className="w-full md:w-64">
          <p className="mb-1 text-[11px] font-medium text-green-800">Assign team lead</p>
          <Select
            value={selectedLeadId}
            onValueChange={setSelectedLeadId}
            disabled={assigningLead || teamLeads.length === 0}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue placeholder={teamLeads.length === 0 ? "No team leads" : "Select team lead"} />
            </SelectTrigger>
            <SelectContent>
              {teamLeads.map((u) => (
                <SelectItem key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-8 w-full md:w-32"
          onClick={handleAssignLead}
          disabled={assigningLead || !selectedLeadId}
        >
          {assigningLead ? "Assigning..." : "Set lead"}
        </Button>
      </div>

      {/* Employee dropdown */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        <div className="w-full md:w-64">
          <p className="mb-1 text-[11px] font-medium text-green-800">Add employee</p>
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
            disabled={assigningEmployee || employees.length === 0}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue placeholder={employees.length === 0 ? "No employees" : "Select employee"} />
            </SelectTrigger>
            <SelectContent>
              {employees.map((u) => (
                <SelectItem key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-8 w-full md:w-32"
          onClick={handleAssignEmployee}
          disabled={assigningEmployee || !selectedEmployeeId}
        >
          {assigningEmployee ? "Adding..." : "Add"}
        </Button>
      </div>

      {(teamLeads.length === 0 || employees.length === 0) && (
        <p className="text-xs text-muted-foreground">
          Missing options? Assign roles first in the Admin → Users page.
        </p>
      )}
    </div>
  );
}