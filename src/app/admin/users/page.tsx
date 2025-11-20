/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/apiUtils";
import { Card } from "@/components/ui/card";

type User = {
  id: number;
  username: string;
  email?: string;
  userType?: string;
  role?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        // Adapt depending on backend response structure
        setUsers(data.users || data.data || data);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 border">
              {user.userType || user.role || "N/A"}
            </span>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-gray-500 mt-6">No users found.</p>
      )}
    </div>
  );
}
