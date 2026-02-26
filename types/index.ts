export type UserRole = "admin" | "team_lead" | "employee";


export type ProjectStatus = "active" | "completed" | "on_hold";

export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pr_submitted"
  | "completed"
  | "rejected";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type DurationUnit =  "minutes" | "hours" | "days";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  assignedProjects?: {
    _id: string;
    name: string;
    status: ProjectStatus;
    description?: string;
  }[];
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface PullRequestInfo {
  url: string;
  message: string;
  submittedAt: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  project:
    | {
        _id: string;
        name: string;
        status?: ProjectStatus;
        description?: string;
      }
    | string;
  createdBy: Pick<User, "_id" | "name" | "email">;
  assignedTo?: (Pick<User, "_id" | "name" | "email" | "role">) | null;
  assignedBy?: (Pick<User, "_id" | "name" | "email">) | null;
  status: TicketStatus;
  priority: TicketPriority;
  estimatedDuration: number | null;
  estimatedUnit: DurationUnit;
  acceptedAt?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  actualDuration?: number | null;
  pullRequest?: PullRequestInfo | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdBy: Pick<User, "_id" | "name" | "email">;
  assignedTeamLead?: Pick<User, "_id" | "name" | "email"> | null;
  assignedEmployees: (Pick<User, "_id" | "name" | "email" | "role">)[];
  tickets?: Ticket[];
  createdAt?: string;
  updatedAt?: string;
}


export interface PaginatedUsersResponse {
  count: number;
  users: User[];
}

export interface PaginatedProjectsResponse {
  count: number;
  projects: Project[];
}

export interface PaginatedTicketsResponse {
  count: number;
  tickets: Ticket[];
}

export interface ProjectResponse {
  project: Project;
}

export interface TicketResponse {
  ticket: Ticket;
}