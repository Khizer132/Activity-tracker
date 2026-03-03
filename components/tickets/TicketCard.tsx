// import type { Ticket, TicketPriority, TicketStatus } from "@/types";
// import { formatDateTime } from "@/lib/utils";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Trash2 } from "lucide-react";
// import { useState } from "react";

// interface TicketCardProps {
//   ticket: Ticket;
//   showProjectName?: boolean;
//   canDelete?: boolean;
//   onDelete?: () => void;
// }

// function priorityVariant(priority: TicketPriority): string {
//   switch (priority) {
//     case "low":
//       return "bg-emerald-50 text-emerald-800 border-emerald-200";
//     case "medium":
//       return "bg-amber-50 text-amber-800 border-amber-200";
//     case "high":
//       return "bg-orange-50 text-orange-800 border-orange-200";
//     case "critical":
//       return "bg-red-50 text-red-800 border-red-200";
//     default:
//       return "bg-gray-50 text-gray-800 border-gray-200";
//   }
// }

// function statusVariant(status: TicketStatus): string {
//   switch (status) {
//     case "open":
//       return "bg-sky-50 text-sky-800 border-sky-200";
//     case "assigned":
//       return "bg-indigo-50 text-indigo-800 border-indigo-200";
//     case "in_progress":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "pr_submitted":
//       return "bg-purple-50 text-purple-800 border-purple-200";
//     case "completed":
//       return "bg-emerald-100 text-emerald-900 border-emerald-200";
//     case "rejected":
//       return "bg-red-50 text-red-800 border-red-200";
//     default:
//       return "bg-gray-50 text-gray-800 border-gray-200";
//   }
// }

// export function TicketCard({
//   ticket,
//   showProjectName,
//   canDelete,
//   onDelete,
// }: TicketCardProps) {
//   const [open, setOpen] = useState(false);

//   const projectName =
//     typeof ticket.project === "string"
//       ? undefined
//       : ticket.project.name ?? "Unknown";

//   const assigneeName = ticket.assignedTo?.name;
//   const assigneeRole = ticket.assignedTo?.role;
//   const showDelete = Boolean(canDelete && onDelete);

//   return (
//     <>
//       <Card
//         className="border-green-200 bg-white cursor-pointer hover:shadow-md transition-shadow overflow-hidden w-full"
//         onClick={() => setOpen(true)}
//       >
//         <CardHeader className="pb-2">
//           <CardTitle className="flex flex-col gap-2 text-sm font-semibold text-green-800 w-full min-w-0">
            
//             <div className="flex items-start justify-between gap-2 w-full min-w-0">
//               <span
//                 className="line-clamp-2 flex-1 min-w-0"
//                 style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//               >
//                 {ticket.title}
//               </span>
//               {showDelete && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   className="h-6 w-6 shrink-0 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDelete?.();
//                   }}
//                 >
//                   <Trash2 className="h-3.5 w-3.5" />
//                 </Button>
//               )}
//             </div>
          
//             <div className="flex flex-wrap gap-1">
//               <Badge
//                 variant="outline"
//                 className={`capitalize border ${statusVariant(ticket.status)}`}
//               >
//                 {ticket.status.replace("_", " ")}
//               </Badge>
//               <Badge
//                 variant="outline"
//                 className={`capitalize border ${priorityVariant(ticket.priority)}`}
//               >
//                 {ticket.priority}
//               </Badge>
//             </div>
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-2 text-xs text-muted-foreground">
//           {showProjectName && projectName && (
//             <p className="font-medium text-green-800">
//               Project:{" "}
//               <span className="font-normal text-muted-foreground">
//                 {projectName}
//               </span>
//             </p>
//           )}

//           {assigneeName ? (
//             <p className="text-xs">
//               Assigned to:{" "}
//               <span className="font-medium text-green-800">{assigneeName}</span>
//               {assigneeRole && (
//                 <span className="text-[11px] text-muted-foreground">
//                   {" "}
//                   ({assigneeRole.replace("_", " ")})
//                 </span>
//               )}
//             </p>
//           ) : (
//             <p className="text-[11px] text-muted-foreground">
//               Not yet assigned to any member.
//             </p>
//           )}

    
//           <p
//             className="line-clamp-3"
//             style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//           >
//             {ticket.description || "No description."}
//           </p>

//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <span>
//               Created:{" "}
//               <span className="font-medium">
//                 {formatDateTime(ticket.createdAt)}
//               </span>
//             </span>
//           </div>
//         </CardContent>
//       </Card>

    
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent
//           className="max-w-lg w-full flex flex-col max-h-[80vh]"
//           style={{ overflow: "hidden" }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <DialogHeader className="shrink-0 pr-6">
//             <DialogTitle
//               className="text-green-800 text-base font-semibold leading-snug"
//               style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//             >
//               {ticket.title}
//             </DialogTitle>
//           </DialogHeader>

        
//           <style>{`
//             .dialog-scroll::-webkit-scrollbar { display: none; }
//             .dialog-scroll { -ms-overflow-style: none; scrollbar-width: none; }
//           `}</style>

//           <div className="dialog-scroll overflow-y-auto flex-1">
//           <div className="space-y-4 text-sm pr-1">
            
//             <div className="flex flex-wrap gap-2">
//               <Badge
//                 variant="outline"
//                 className={`capitalize border ${statusVariant(ticket.status)}`}
//               >
//                 {ticket.status.replace("_", " ")}
//               </Badge>
//               <Badge
//                 variant="outline"
//                 className={`capitalize border ${priorityVariant(ticket.priority)}`}
//               >
//                 {ticket.priority}
//               </Badge>
//             </div>

         
//             {showProjectName && projectName && (
//               <p className="text-sm font-medium text-green-800">
//                 Project:{" "}
//                 <span className="font-normal text-muted-foreground">
//                   {projectName}
//                 </span>
//               </p>
//             )}

           
//             {assigneeName ? (
//               <p className="text-sm">
//                 Assigned to:{" "}
//                 <span className="font-medium text-green-800">{assigneeName}</span>
//                 {assigneeRole && (
//                   <span className="text-xs text-muted-foreground">
//                     {" "}
//                     ({assigneeRole.replace("_", " ")})
//                   </span>
//                 )}
//               </p>
//             ) : (
//               <p className="text-xs text-muted-foreground">
//                 Not yet assigned to any member.
//               </p>
//             )}

          
//             <div className="rounded-lg border border-green-200 bg-green-50/40 p-3 space-y-2">
//               <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">
//                 Description
//               </p>
//               <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
//                 {ticket.description || "No description provided."}
//               </p>
//             </div>

          
//             {ticket.pullRequest?.url && (
//               <div>
//                 <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
//                   Pull Request
//                 </p>
//                 <a
//                   href={ticket.pullRequest.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-green-700 underline break-all"
//                 >
//                   {ticket.pullRequest.url}
//                 </a>
//                 {ticket.pullRequest.message && (
//                   <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
//                     {ticket.pullRequest.message}
//                   </p>
//                 )}
//               </div>
//             )}

          
//             <p className="text-xs text-muted-foreground">
//               Created:{" "}
//               <span className="font-medium">{formatDateTime(ticket.createdAt)}</span>
//             </p>
//           </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

interface TicketCardProps {
  ticket: Ticket;
  showProjectName?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  /** Stage controls (employee) or approval controls (admin/lead) rendered inside the dialog */
  dialogActions?: ReactNode;
}

function priorityVariant(priority: TicketPriority): string {
  switch (priority) {
    case "low":      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "medium":   return "bg-amber-50 text-amber-800 border-amber-200";
    case "high":     return "bg-orange-50 text-orange-800 border-orange-200";
    case "critical": return "bg-red-50 text-red-800 border-red-200";
    default:         return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

function statusVariant(status: TicketStatus): string {
  switch (status) {
    case "open":         return "bg-sky-50 text-sky-800 border-sky-200";
    case "assigned":     return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "in_progress":  return "bg-green-100 text-green-800 border-green-200";
    case "pr_submitted": return "bg-purple-50 text-purple-800 border-purple-200";
    case "completed":    return "bg-emerald-100 text-emerald-900 border-emerald-200";
    case "rejected":     return "bg-red-50 text-red-800 border-red-200";
    default:             return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

export function TicketCard({
  ticket,
  showProjectName,
  canDelete,
  onDelete,
  dialogActions,
}: TicketCardProps) {
  const [open, setOpen] = useState(false);

  const projectName =
    typeof ticket.project === "string"
      ? undefined
      : ticket.project.name ?? "Unknown";

  const assigneeName = ticket.assignedTo?.name;
  const assigneeRole = ticket.assignedTo?.role;
  const showDelete = Boolean(canDelete && onDelete);

  return (
    <>
      {/* Card */}
      <Card
        className="border-green-200 bg-white cursor-pointer hover:shadow-md transition-shadow overflow-hidden w-full"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-col gap-2 text-sm font-semibold text-green-800 w-full min-w-0">
            {/* Row 1: Title + Delete */}
            <div className="flex items-start justify-between gap-2 w-full min-w-0">
              <span
                className="line-clamp-2 flex-1 min-w-0"
                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {ticket.title}
              </span>
              {showDelete && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 shrink-0 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {/* Row 2: Badges */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={`capitalize border ${statusVariant(ticket.status)}`}>
                {ticket.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className={`capitalize border ${priorityVariant(ticket.priority)}`}>
                {ticket.priority}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-xs text-muted-foreground">
          {showProjectName && projectName && (
            <p className="font-medium text-green-800">
              Project: <span className="font-normal text-muted-foreground">{projectName}</span>
            </p>
          )}
          {assigneeName ? (
            <p className="text-xs">
              Assigned to: <span className="font-medium text-green-800">{assigneeName}</span>
              {assigneeRole && (
                <span className="text-[11px] text-muted-foreground"> ({assigneeRole.replace("_", " ")})</span>
              )}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">Not yet assigned to any member.</p>
          )}
          <p className="line-clamp-3" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
            {ticket.description || "No description."}
          </p>
          <span>Created: <span className="font-medium">{formatDateTime(ticket.createdAt)}</span></span>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg w-full flex flex-col max-h-[80vh]"
          style={{ overflow: "hidden" }}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="shrink-0 pr-6">
            <DialogTitle
              className="text-green-800 text-base font-semibold leading-snug"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {ticket.title}
            </DialogTitle>
          </DialogHeader>

          <style>{`
            .dialog-scroll::-webkit-scrollbar { display: none; }
            .dialog-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          <div className="dialog-scroll overflow-y-auto flex-1">
            <div className="space-y-4 text-sm pr-1">

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`capitalize border ${statusVariant(ticket.status)}`}>
                  {ticket.status.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className={`capitalize border ${priorityVariant(ticket.priority)}`}>
                  {ticket.priority}
                </Badge>
              </div>

              {/* Project */}
              {showProjectName && projectName && (
                <p className="text-sm font-medium text-green-800">
                  Project: <span className="font-normal text-muted-foreground">{projectName}</span>
                </p>
              )}

              {/* Assignee */}
              {assigneeName ? (
                <p className="text-sm">
                  Assigned to: <span className="font-medium text-green-800">{assigneeName}</span>
                  {assigneeRole && (
                    <span className="text-xs text-muted-foreground"> ({assigneeRole.replace("_", " ")})</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Not yet assigned to any member.</p>
              )}

              {/* Description */}
              <div className="rounded-lg border border-green-200 bg-green-50/40 p-3 space-y-2">
                <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Description</p>
                <p
                  className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed"
                  style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                >
                  {ticket.description || "No description provided."}
                </p>
              </div>

              {/* PR link */}
              {ticket.pullRequest?.url && (
                <div className="rounded-lg border border-purple-100 bg-purple-50/40 p-3 space-y-1">
                  <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide">Pull Request</p>
                  <a
                    href={ticket.pullRequest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-700 underline break-all"
                  >
                    {ticket.pullRequest.url}
                  </a>
                  {ticket.pullRequest.message && (
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{ticket.pullRequest.message}</p>
                  )}
                </div>
              )}

              {/* Created date */}
              <p className="text-xs text-muted-foreground">
                Created: <span className="font-medium">{formatDateTime(ticket.createdAt)}</span>
              </p>

              {/* Actions slot */}
              {dialogActions && (
                <div className="rounded-lg border border-green-200 bg-green-50/30 p-3 space-y-2">
                  <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Actions</p>
                  {dialogActions}
                </div>
              )}

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}