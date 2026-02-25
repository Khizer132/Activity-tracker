import type { UserRole } from "@/types";
import type { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  userRole: UserRole | undefined;
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, userRole, fallback }: RoleGuardProps) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback ?? (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="font-medium text-destructive">Access denied</p>
        <p className="text-sm text-destructive/80">
          Admin feature - You don&apos;t have permission to view this content.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}