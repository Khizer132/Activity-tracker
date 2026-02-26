// "use client";

// import { useEffect, useState, use } from "react";
// import type { Project, Ticket, UserRole } from "@/types";
// import { getMe, getProjectById } from "@/lib/api";
// import { formatDate, formatDateTime } from "@/lib/utils";
// import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
// import { TicketCard } from "@/components/tickets/TicketCard";
// import { TicketForm } from "@/components/tickets/TicketForm";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// interface ProjectDetailPageProps {
//   params: Promise<{ id: string }>;
// }

// export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
//   const { id } = use(params); 
//   const [project, setProject] = useState<Project | null>(null);
//   const [role, setRole] = useState<UserRole | undefined>(undefined);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         const [meRes, projectRes] = await Promise.all([
//           getMe(),
//           getProjectById(id),
//         ]);
//         if (!active) return;
//         setRole(meRes.user.role);
//         setProject(projectRes.project);
//       } catch (err) {
//         if (!active) return;
//         setError(
//           err instanceof Error ? err.message : "Failed to load project."
//         );
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, [id]);

//   const handleTicketCreated = (ticket: Ticket) => {
//     setProject((prev) =>
//       prev
//         ? {
//             ...prev,
//             tickets: [ticket, ...(prev.tickets ?? [])],
//           }
//         : prev
//     );
//   };

//   if (loading) {
//     return <LoadingSpinner className="mt-8" />;
//   }

//   if (error || !project) {
//     return (
//       <p className="text-sm text-destructive">
//         {error ?? "Project not found."}
//       </p>
//     );
//   }

//   const tickets = (project.tickets as Ticket[] | undefined) ?? [];

//   return (
//     <div className="space-y-6">
//       <Card className="border-green-200 bg-white">
//         <CardHeader>
//           <CardTitle className="flex flex-col gap-1">
//             <span className="text-lg font-semibold text-green-800">
//               {project.name}
//             </span>
//             <span className="text-xs text-muted-foreground">
//               Created {formatDate(project.createdAt)}
//             </span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4 text-sm text-muted-foreground">
//           {project.description ? (
//             <p>{project.description}</p>
//           ) : (
//             <p className="italic">No description provided.</p>
//           )}

//           <div className="flex flex-wrap gap-6">
//             <div>
//               <p className="text-xs font-medium text-green-700">Status</p>
//               <p className="text-sm capitalize">{project.status}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-green-700">
//                 Team lead (if any)
//               </p>
//               <p className="text-sm">
//                 {project.assignedTeamLead
//                   ? project.assignedTeamLead.name
//                   : "Unassigned"}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-green-700">
//                 Team members
//               </p>
//               <p className="text-sm">
//                 {project.assignedEmployees?.length ?? 0}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-green-700">
//                 Tickets linked
//               </p>
//               <p className="text-sm">{tickets.length}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {(role === "admin" || role === "team_lead") && (
//         <Card className="border-green-200 bg-white">
//           <CardHeader>
//             <CardTitle className="text-sm font-semibold text-green-800">
//               Create ticket in this project
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TicketForm projectId={project._id} onCreated={handleTicketCreated} />
//           </CardContent>
//         </Card>
//       )}

//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold text-green-800">Tickets</h2>
//         {tickets.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No tickets yet for this project.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {tickets.map((ticket) => (
//               <TicketCard
//                 key={ticket._id}
//                 ticket={ticket}
//                 showProjectName={false}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       <p className="text-xs text-muted-foreground">
//         Last updated: {formatDateTime(project.updatedAt)}
//       </p>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, use } from "react";
import type { Project, Ticket, UserRole } from "@/types";
import { getMe, getProjectById } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TicketCard } from "@/components/tickets/TicketCard";
import { TicketForm } from "@/components/tickets/TicketForm";
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
  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setDialogOpen(false); // close dialog after successful creation
  };

  if (loading) {
    return <LoadingSpinner className="mt-8" />;
  }

  if (error || !project) {
    return (
      <p className="text-sm text-destructive">
        {error ?? "Project not found."}
      </p>
    );
  }

  const tickets = (project.tickets as Ticket[] | undefined) ?? [];

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-white">
        <CardHeader>
          <CardTitle className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-green-800">
              {project.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Created {formatDate(project.createdAt)}
            </span>
          </CardTitle>
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
                Team lead (if any)
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
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-800">Tickets</h2>

          {(role === "admin" || role === "team_lead") && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00d800] hover:bg-[#00d800]/90 gap-1.5">
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
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                showProjectName={false}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated: {formatDateTime(project.updatedAt)}
      </p>
    </div>
  );
}