"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Users,
  FolderCog,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "team_lead", "employee"] },
  { href: "/dashboard/admin", label: "Admin", icon: Users, roles: ["admin"] },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, roles: ["admin", "team_lead", "employee"] },
  { href: "/dashboard/tickets", label: "Tickets", icon: Ticket, roles: ["admin", "team_lead", "employee"] },
];

export function Sidebar({ role }: { role: UserRole | undefined }) {
  const pathname = usePathname();
  const visibleItems = role ? navItems.filter((item) => item.roles.includes(role)) : [];

  return (
    <aside className="flex h-full w-56 flex-col border-r border-green-200 bg-white">
      <div className="flex h-14 items-center px-4 border-b border-green-200">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-green-800">
          <FolderCog className="size-6" />
          TechDesk
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-100 text-green-800"
                  : "text-muted-foreground hover:bg-green-50 hover:text-green-800"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator className="bg-green-200" />
    </aside>
  );
}