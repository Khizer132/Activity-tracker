"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
    name: string;
    email: string;
    role: string;
}

function getInitials(name: string) {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
}

function formatRole(role: string) {
    return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Header({ name, email, role }: HeaderProps) {
    return (
        <header className="flex h-14 items-center justify-end gap-4 border-b border-green-200 bg-white px-6">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="size-8 border border-green-200">
                            <AvatarFallback className="bg-green-100 text-green-800 text-sm">
                                {getInitials(name)} 
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden text-left text-sm sm:block">
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{formatRole(role)}</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                            <span>{name}</span>
                            <span className="text-xs font-normal text-muted-foreground">{email}</span>
                            <span className="text-xs font-normal text-muted-foreground">{formatRole(role)}</span>
                        </div>
                    </DropdownMenuLabel>
                    {/* <DropdownMenuSeparator /> */}
                    {/* <DropdownMenuItem disabled className="cursor-default">
            <User className="mr-2 size-4" />
            Profile (coming soon)
          </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    >
                        <LogOut className="mr-2 size-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}