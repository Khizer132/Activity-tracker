// "use client";

// import { useEffect, useState } from "react";
// import type { Ticket, TicketStatus, UserRole } from "@/types";
// import { getMe, getTickets, deleteTicket } from "@/lib/api";
// import { TicketCard } from "@/components/tickets/TicketCard";
// import { TicketStageControls } from "@/components/tickets/TicketStageControls";
// import { TicketApprovalControls } from "@/components/tickets/TicketApprovalControls";
// import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// const statusOrder: TicketStatus[] = [
//   "open",
//   "assigned",
//   "in_progress",
//   "pr_submitted",
//   "completed",
//   "rejected",
// ];

// const statusLabel: Record<TicketStatus, string> = {
//   open: "Open",
//   assigned: "Assigned",
//   in_progress: "In progress",
//   pr_submitted: "PR submitted",
//   completed: "Completed",
//   rejected: "Rejected",
// };

// export default function TicketsPage() {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [role, setRole] = useState<UserRole | undefined>(undefined);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         const [meRes, ticketsRes] = await Promise.all([getMe(), getTickets()]);
//         if (!active) return;
//         setRole(meRes.user.role);
//         setTickets(ticketsRes.tickets);
//       } catch (err) {
//         if (!active) return;
//         setError(
//           err instanceof Error ? err.message : "Failed to load tickets."
//         );
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, []);

//   const handleTicketUpdated = (updated: Ticket) => {
//     setTickets((prev) =>
//       prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t))
//     );
//   };

//   const handleDeleteTicket = async (ticketId: string) => {
//     if (deletingTicketId) return;

//     if (
//       !window.confirm(
//         "Are you sure you want to delete this ticket? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     setError(null);
//     setDeletingTicketId(ticketId);
//     try {
//       await deleteTicket(ticketId);
//       setTickets((prev) => prev.filter((t) => t._id !== ticketId));
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to delete ticket."
//       );
//     } finally {
//       setDeletingTicketId(null);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <p className="text-sm text-destructive">{error}</p>;
//   }

//   const grouped = statusOrder.map((status) => ({
//     status,
//     tickets: tickets.filter((t) => t.status === status),
//   }));

//   const isAdmin = role === "admin";
//   const isEmployee = role === "employee";
//   const canApprove = role === "admin" || role === "team_lead";

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-green-800">Tickets</h1>
//         <p className="text-muted-foreground">
//           All tickets you can see, grouped by status.
//         </p>
//       </div>

//       <style>{`
//         .green-scrollbar {
//           scroll-behavior: smooth;
//         }

//         .green-scrollbar::-webkit-scrollbar {
//           height: 4px;
//         }

//         .green-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//           border-radius: 9999px;
//         }

//         .green-scrollbar::-webkit-scrollbar-thumb {
//           background: #86efac;
//           border-radius: 9999px;
//           transition: background 0.3s ease;
//         }

//         .green-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #22c55e;
//         }

//         .green-scrollbar::-webkit-scrollbar-thumb:active {
//           background: #16a34a;
//         }

//         .green-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #86efac transparent;
//         }
//       `}</style>

//       <div className="green-scrollbar flex gap-4 overflow-x-auto pb-4">
//         {grouped.map(({ status, tickets }) => (
//           <div
//             key={status}
//             className="w-72 shrink-0 space-y-3 rounded-lg border border-green-200 bg-white p-4"
//           >
//             <h2 className="text-sm font-semibold text-green-800">
//               {statusLabel[status]} ({tickets.length})
//             </h2>
//             {tickets.length === 0 ? (
//               <p className="text-xs text-muted-foreground">
//                 No tickets in this column.
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {tickets.map((ticket) => (
//                   <div key={ticket._id} className="space-y-1">
//                     <TicketCard
//                       ticket={ticket}
//                       showProjectName
//                       canDelete={isAdmin}
//                       onDelete={() => handleDeleteTicket(ticket._id)}
//                     />
//                     {isEmployee && (
//                       <TicketStageControls
//                         ticket={ticket}
//                         onTicketUpdated={handleTicketUpdated}
//                       />
//                     )}
//                     {canApprove && ticket.status === "pr_submitted" && (
//                       <TicketApprovalControls
//                         ticket={ticket}
//                         onTicketUpdated={handleTicketUpdated}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import type { Ticket, TicketStatus, UserRole } from "@/types";
import { getMe, getTickets, deleteTicket } from "@/lib/api";
import { TicketCard } from "@/components/tickets/TicketCard";
import { TicketStageControls } from "@/components/tickets/TicketStageControls";
import { TicketApprovalControls } from "@/components/tickets/TicketApprovalControls";
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
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meRes, ticketsRes] = await Promise.all([getMe(), getTickets()]);
        if (!active) return;
        setRole(meRes.user.role);
        setTickets(ticketsRes.tickets);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load tickets.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleTicketUpdated = (updated: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t))
    );
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (deletingTicketId) return;
    if (!window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) return;

    setError(null);
    setDeletingTicketId(ticketId);
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ticket.");
    } finally {
      setDeletingTicketId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  const grouped = statusOrder.map((status) => ({
    status,
    tickets: tickets.filter((t) => t.status === status),
  }));

  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const canApprove = role === "admin" || role === "team_lead";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-800">Tickets</h1>
        <p className="text-muted-foreground">All tickets you can see, grouped by status.</p>
      </div>

      <style>{`
        .green-scrollbar { scroll-behavior: smooth; }
        .green-scrollbar::-webkit-scrollbar { height: 4px; }
        .green-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 9999px; }
        .green-scrollbar::-webkit-scrollbar-thumb { background: #86efac; border-radius: 9999px; transition: background 0.3s ease; }
        .green-scrollbar::-webkit-scrollbar-thumb:hover { background: #22c55e; }
        .green-scrollbar::-webkit-scrollbar-thumb:active { background: #16a34a; }
        .green-scrollbar { scrollbar-width: thin; scrollbar-color: #86efac transparent; }
      `}</style>

      <div className="green-scrollbar flex gap-4 overflow-x-auto pb-4">
        {grouped.map(({ status, tickets }) => (
          <div
            key={status}
            className="w-72 shrink-0 space-y-3 rounded-lg border border-green-200 bg-white p-4"
          >
            <h2 className="text-sm font-semibold text-green-800">
              {statusLabel[status]} ({tickets.length})
            </h2>
            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tickets in this column.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    showProjectName
                    canDelete={isAdmin}
                    onDelete={() => handleDeleteTicket(ticket._id)}
                    dialogActions={
                      <>
                        {isEmployee && (
                          <TicketStageControls
                            ticket={ticket}
                            onTicketUpdated={handleTicketUpdated}
                          />
                        )}
                        {canApprove && ticket.status === "pr_submitted" && (
                          <TicketApprovalControls
                            ticket={ticket}
                            onTicketUpdated={handleTicketUpdated}
                          />
                        )}
                      </>
                    }
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