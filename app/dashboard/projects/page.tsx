// "use client";

// import { useEffect, useState } from "react";
// import type { Project, UserRole } from "@/types";
// import { getMe, getProjects } from "@/lib/api";
// import { ProjectCard } from "@/components/projects/ProjectCard";
// import { ProjectForm } from "@/components/projects/ProjectForm";
// import { LoadingSpinner} from "@/components/shared/LoadingSpinner";

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [role, setRole] = useState<UserRole | undefined>(undefined);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         const [meRes, projectsRes] = await Promise.all([getMe(), getProjects()]);
//         if (!active) return;
//         setRole(meRes.user.role);
//         setProjects(projectsRes.projects);
//       } catch (err) {
//         if (!active) return;
//         setError(
//           err instanceof Error ? err.message : "Failed to load projects."
//         );
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, []);

//   const handleProjectCreated = (project: Project) => {
//     setProjects((prev) => [project, ...prev]);
//   };

//   if (loading) {
//     return <LoadingSpinner className="mt-8" />;
//   }

//   if (error) {
//     return <p className="text-sm text-destructive">{error}</p>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-green-800">Projects</h1>
//           <p className="text-muted-foreground">
//             View all projects you&apos;re involved in.
//           </p>
//         </div>
//         {role === "admin" && (
//           <div className="w-full max-w-md">
//             <ProjectForm onCreated={handleProjectCreated} />
//           </div>
//         )}
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//         {projects.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No projects yet. Admins can create a project using the form above.
//           </p>
//         ) : (
//           projects.map((project) => (
//             <ProjectCard key={project._id} project={project} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import type { Project, UserRole } from "@/types";
import { getMe, getProjects } from "@/lib/api";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meRes, projectsRes] = await Promise.all([getMe(), getProjects()]);
        if (!active) return;
        setRole(meRes.user.role);
        setProjects(projectsRes.projects);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load projects."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleProjectCreated = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setDialogOpen(false); // close dialog after successful creation
  };

  if (loading) {
    return <LoadingSpinner className="mt-8" />;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Projects</h1>
          <p className="text-muted-foreground">
            View all projects you&apos;re involved in.
          </p>
        </div>

        {role === "admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00d800] hover:bg-[#00d800]/90 gap-1.5">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Create new project
                </DialogTitle>
              </DialogHeader>
              <ProjectForm onCreated={handleProjectCreated} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No projects yet. Admins can create a project using the button above.
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}