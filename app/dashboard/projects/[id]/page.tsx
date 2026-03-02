"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import type { Project, Ticket, UserRole } from "@/types";
import {
  getMe,
  getProjectById,
  deleteProject,
  deleteTicket,
} from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TicketCard } from "@/components/tickets/TicketCard";
import { TicketForm } from "@/components/tickets/TicketForm";
import { AssignMemberForm } from "@/components/projects/AssignMemberForm";
import { AssignTicketControl } from "@/components/tickets/AssignTicketControl";
import { TicketStageControls } from "@/components/tickets/TicketStageControls";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meRes, projectRes] = await Promise.all([
          getMe(),
          getProjectById(id),
        ]);
        if (!active) return;
        setRole(meRes.user.role);
        setProject(projectRes.project);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load project."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);


  const handleTicketCreated = (ticket: Ticket) => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tickets: [ticket, ...(prev.tickets ?? [])],
          }
        : prev
    );
    setDialogOpen(false);
  };

  const handleTicketUpdated = (updated: Ticket) => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tickets: (prev.tickets ?? []).map((t) =>
              t._id === updated._id ? { ...t, ...updated } : t
            ),
          }
        : prev
    );
  };

  const handleProjectUpdated = (updated: Project) => {
    setProject(updated);
  };

  const handleDeleteProject = async () => {
    if (deletingProject || !project) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this project? All related tickets will also be removed."
      )
    ) {
      return;
    }

    setActionError(null);
    setDeletingProject(true);
    try {
      await deleteProject(project._id);
      router.push("/dashboard/projects");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete project."
      );
      setDeletingProject(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (deletingTicketId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      return;
    }

    setActionError(null);
    setDeletingTicketId(ticketId);
    try {
      await deleteTicket(ticketId);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              tickets: (prev.tickets ?? []).filter((t) => t._id !== ticketId),
            }
          : prev
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete ticket."
      );
    } finally {
      setDeletingTicketId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !project) {
    return (
      <p className="text-sm text-destructive">
        {error ?? "Project not found."}
      </p>
    );
  }

  const tickets = (project.tickets as Ticket[] | undefined) ?? [];
  const canManageMembers = role === "admin";
  const canManageTickets = role === "admin" || role === "team_lead";
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-green-800">
                {project.name}
              </span>
              <span className="text-xs text-muted-foreground">
                Created {formatDate(project.createdAt)}
              </span>
            </CardTitle>

            {isAdmin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={handleDeleteProject}
                disabled={deletingProject}
              >
                {deletingProject ? "Deleting..." : "Delete project"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {project.description ? (
            <p>{project.description}</p>
          ) : (
            <p className="italic">No description provided.</p>
          )}

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium text-green-700">Status</p>
              <p className="text-sm capitalize">{project.status}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700">
                Team lead
              </p>
              <p className="text-sm">
                {project.assignedTeamLead
                  ? project.assignedTeamLead.name
                  : "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700">
                Team members
              </p>
              <p className="text-sm">
                {project.assignedEmployees?.length ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700">
                Tickets linked
              </p>
              <p className="text-sm">{tickets.length}</p>
            </div>
          </div>

          {canManageMembers && (
            <div className="border-t border-green-100 pt-3">
              <AssignMemberForm
                projectId={project._id}
                onProjectUpdated={handleProjectUpdated}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-800">Tickets</h2>

          {canManageTickets && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1.5 bg-[#00d800] hover:bg-[#00d800]/90">
                  <Plus className="h-4 w-4" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-green-800">
                    Create new ticket
                  </DialogTitle>
                </DialogHeader>
                <TicketForm
                  projectId={project._id}
                  onCreated={handleTicketCreated}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tickets yet for this project.
          </p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="space-y-1">
                <TicketCard
                  ticket={ticket}
                  showProjectName={false}
                  canDelete={isAdmin}
                  onDelete={() => handleDeleteTicket(ticket._id)}
                />
                {isEmployee && (
                  <TicketStageControls
                    ticket={ticket}
                    onTicketUpdated={handleTicketUpdated}
                  />
                )}
                {canManageTickets && (
                  <AssignTicketControl
                    ticket={ticket}
                    project={project}
                    onTicketUpdated={handleTicketUpdated}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {actionError && (
        <p className="text-xs text-destructive">{actionError}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated: {formatDateTime(project.updatedAt)}
      </p>
    </div>
  );
}
