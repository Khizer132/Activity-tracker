"use client";

import { useEffect, useState } from "react";
import type { User, UserRole } from "@/types";
import {
  getUsers,
  updateUserRole,
  deleteUser as deleteUserApi,
} from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getUsers();
        if (!active) return;
        setUsers(res.users);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Failed to load users."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setSavingId(userId);
    try {
      const { user, message } = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, ...user } : u))
      );
      // toast({
      //   title: "Role updated",
      //   description: message,
      // });
    } catch (err) {
      console.error(err);
      // toast({
      //   title: "Failed to update role",
      //   description:
      //     err instanceof Error ? err.message : "Something went wrong.",
      // });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const confirmed = window.confirm(
      `Deactivate user "${user.name}"? They will no longer be able to sign in.`
    );
    if (!confirmed) return;

    setDeletingId(userId);
    try {
      const { message } = await deleteUserApi(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: false } : u
        )
      );
      // toast({
      //   title: "User deactivated",
      //   description: message,
      // });
    } catch (err) {
      console.error(err);
      // toast({
      //   title: "Failed to deactivate user",
      //   description:
      //     err instanceof Error ? err.message : "Something went wrong.",
      // });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner className="mt-4" />;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No users found in the system.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-green-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-green-50/60">
            <TableHead className="text-xs font-semibold text-green-800">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold text-green-800">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold text-green-800">
              Role
            </TableHead>
            <TableHead className="text-xs font-semibold text-green-800">
              Projects
            </TableHead>
            <TableHead className="text-xs font-semibold text-green-800">
              Status
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-green-800">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isInactive = user.isActive === false;
            const projectsCount = user.assignedProjects?.length ?? 0;

            return (
              <TableRow key={user._id} className="align-middle">
                <TableCell className="text-sm">{user.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-sm">
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      handleRoleChange(user._id, value as UserRole)
                    }
                    disabled={savingId === user._id || isInactive}
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="team_lead">Team lead</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm">{projectsCount}</TableCell>
                <TableCell className="text-sm">
                  {isInactive ? (
                    <Badge variant="outline" className="border-red-300 text-red-700">
                      Inactive
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-green-300 text-green-700"
                    >
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={deletingId === user._id || isInactive}
                    onClick={() => handleDelete(user._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
