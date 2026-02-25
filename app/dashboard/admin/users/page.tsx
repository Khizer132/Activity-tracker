"use client";
import { useEffect, useState } from "react";
import { User } from "@/types";


export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);


  return (
    <div className="space-y-8">
        <h2 className="text-xl font-semibold text-green-800">User Management</h2>
        <p className="text-muted-foreground">Admin-only user management content goes here.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-green-200">
            <thead>
              <tr>  
                <th className="border border-green-200 px-4 py-2 text-left text-sm font-medium text-green-800">Name</th>
                <th className="border border-green-200 px-4 py-2 text-left text-sm font-medium text-green-800">Email</th>
                <th className="border border-green-200 px-4 py-2 text-left text-sm font-medium text-green-800">Role</th>        
                </tr>

            </thead>
            </table>
        </div>
    </div>
  );
}