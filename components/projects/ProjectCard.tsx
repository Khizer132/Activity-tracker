import Link from "next/link";
import type { Project, ProjectStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
}

function statusVariant(status: ProjectStatus): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "on_hold":
      return "bg-amber-50 text-amber-800 border-amber-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const ticketsCount = project.tickets?.length ?? 0;
  const membersCount = project.assignedEmployees?.length ?? 0;

  return (
    <Card className="flex h-full flex-col border-green-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-green-800">
            {project.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={`capitalize border ${statusVariant(project.status)}`}
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Created {formatDate(project.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3 text-sm">
        <p className="line-clamp-3 text-muted-foreground">
          {project.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Members: {membersCount}</span>
          <span>Tickets: {ticketsCount}</span>
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href={`/dashboard/projects/${project._id}`}
            className="text-xs font-medium text-green-700 underline-offset-2 hover:underline"
          >
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
