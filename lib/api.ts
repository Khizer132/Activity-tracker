
import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import type {
  AuthResponse,
  MeResponse,
  PaginatedProjectsResponse,
  PaginatedTicketsResponse,
  PaginatedUsersResponse,
  ProjectResponse,
  TicketResponse,
  UserRole,
  TicketPriority,
  DurationUnit,
  Project,
  Ticket,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Axios instance with base URL and default headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization header
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

// ---------- Auth ----------

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/api/auth/register`,
    {
      name,
      email,
      password,
    }
  );
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/api/auth/login`,
    {
      email,
      password,
    }
  );
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/api/auth/me");
  return data;
}

// ---------- Users (Admin) ----------

export async function getUsers(): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>("/api/users");
  return data;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ message: string; user: User }> {
  const { data } = await api.patch<{ message: string; user: User }>(
    `/api/users/${userId}/role`,
    { role }
  );
  return data;
}

export async function deleteUser(
  userId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/users/${userId}`
  );
  return data;
}

export async function assignUserToProject(
  userId: string,
  projectId: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    `/api/users/${userId}/assign-project`,
    { projectId }
  );
  return data;
}

export async function removeUserFromProject(
  userId: string,
  projectId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/users/${userId}/assign-project/${projectId}`
  );
  return data;
}

// ---------- Projects ----------

export async function getProjects(): Promise<PaginatedProjectsResponse> {
  const { data } = await api.get<PaginatedProjectsResponse>("/api/projects");
  return data;
}

export async function getProjectById(
  projectId: string
): Promise<ProjectResponse> {
  const { data } = await api.get<ProjectResponse>(`/api/projects/${projectId}`);
  return data;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export async function createProject(
  input: CreateProjectInput
): Promise<{ message: string; project: Project }> {
  const { data } = await api.post<{ message: string; project: Project }>(
    "/api/projects",
    input
  );
  return data;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: "active" | "completed" | "on_hold";
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<{ message: string; project: Project }> {
  const { data } = await api.patch<{ message: string; project: Project }>(
    `/api/projects/${projectId}`,
    input
  );
  return data;
}

export async function deleteProject(
  projectId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/projects/${projectId}`
  );
  return data;
}

export async function assignMemberToProject(
  projectId: string,
  userId: string,
  memberRole: "team_lead" | "employee"
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    `/api/projects/${projectId}/assign`,
    { userId, memberRole }
  );
  return data;
}

// ---------- Tickets ----------

export async function getTickets(): Promise<PaginatedTicketsResponse> {
  const { data } = await api.get<PaginatedTicketsResponse>("/api/tickets");
  return data;
}

export async function getTicketById(
  ticketId: string
): Promise<TicketResponse> {
  const { data } = await api.get<TicketResponse>(`/api/tickets/${ticketId}`);
  return data;
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  projectId: string;
  priority?: TicketPriority;
}

export async function createTicket(
  input: CreateTicketInput
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.post<{ message: string; ticket: Ticket }>(
    "/api/tickets",
    input
  );
  return data;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
}

export async function updateTicket(
  ticketId: string,
  input: UpdateTicketInput
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.patch<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}`,
    input
  );
  return data;
}

export async function deleteTicket(
  ticketId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/tickets/${ticketId}`
  );
  return data;
}

export async function assignTicket(
  ticketId: string,
  employeeId: string
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.post<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}/assign`,
    { employeeId }
  );
  return data;
}

export async function setTicketEstimatedDuration(
  ticketId: string,
  estimatedDuration: number,
  estimatedUnit: DurationUnit = "hours"
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.patch<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}/duration`,
    { estimatedDuration, estimatedUnit }
  );
  return data;
}

export async function acceptTicket(
  ticketId: string
): Promise<{ message: string; ticket: Pick<Ticket, "_id" | "status" | "acceptedAt"> }> {
  const { data } = await api.post<{
    message: string;
    ticket: Pick<Ticket, "_id" | "status" | "acceptedAt">;
  }>(`/api/tickets/${ticketId}/accept`);
  return data;
}

export async function submitTicketPullRequest(
  ticketId: string,
  url: string,
  message: string
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.post<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}/submit-pr`,
    { url, message }
  );
  return data;
}

export async function completeTicket(
  ticketId: string
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.post<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}/complete`
  );
  return data;
}

export async function rejectTicket(
  ticketId: string
): Promise<{ message: string; ticket: Ticket }> {
  const { data } = await api.post<{ message: string; ticket: Ticket }>(
    `/api/tickets/${ticketId}/reject`
  );
  return data;
}
