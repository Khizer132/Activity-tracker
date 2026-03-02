import { useEffect, useState } from "react";
import type { Project, User } from "@/types";
import { getUsers, assignMemberToProject, getProjectById } from "@/lib/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"


type MemberRoleOption = "team_lead" | "employee";

interface AssignMemberFormProps {
    projectId: string,
    onProjectUpdated: (project: Project) => void
}

export function AssignMemberForm({ projectId, onProjectUpdated }: AssignMemberFormProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [memberRole, setMemberRole] = useState<MemberRoleOption>("employee");


    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await getUsers();
                if (!active) return;
                const candidates = res.users.filter((u) => u.role === "team_lead" || u.role === "employee");
                setUsers(candidates);
            } catch (err) {
                console.error(err);
                // toast({
                //     title: "Failed to load users",
                //     description:
                //         err instanceof Error ? err.message : "Something went wrong.",
                // });
            } finally {
                if (active) setLoadingUsers(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const handleAssign = async () => {
        if (!selectedUserId) {
            //   toast({
            //     title: "Select a user",
            //     description: "Please choose a member to assign to this project.",
            //   });
            return;
        }

        setAssigning(true);
        try {
            await assignMemberToProject(projectId, selectedUserId, memberRole);
            const { project } = await getProjectById(projectId);
            //   toast({
            //     title: "Member assigned",
            //     description: "The member has been linked to this project.",
            //   });

            onProjectUpdated?.(project);
            setSelectedUserId("");
            setMemberRole("employee");
        } catch (err) {
            console.error(err);
            //   toast({
            //     title: "Failed to assign member",
            //     description:
            //       err instanceof Error ? err.message : "Something went wrong.",
            //   });
        } finally {
            setAssigning(false);
        }
    };

    if (loadingUsers) {
        return <p className="textxs text-muted-foreground">Loading assignable members</p>;
    }

    if (users.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">
                No team leads or employees available to assign.
            </p>
        );
    }

    return (
        <div className="space-y-2 rounded-lg border border-green-100 bg-green-50/40 p-3">
            <p className="text-xs font-semibold text-green-800">Assign members to this project</p>
            <div className="flex flex-col gap-2 md:flex-row">
                <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                    disabled={assigning}
                >
                    <SelectTrigger className="h-8 w-full md:w-64 text-xs">
                        <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                                {user.name} ({user.email}) – {user.role.replace("_", " ")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={memberRole}
                    onValueChange={(value) => setMemberRole(value as MemberRoleOption)}
                    disabled={assigning}
                >
                    <SelectTrigger className="h-8 w-full md:w-64 text-xs">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="team_lead">Team Lead</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                </Select>

                <Button className="h-8 w-full md:w-32" onClick={handleAssign} disabled={assigning}>
                    {assigning ? "Assigning..." : "Assign"}
                </Button>

            </div>

        </div>
    )

}