/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login, getUserType } from "@/lib/apiUtils";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password); // just saves token, no redirect
      toast.success("Login successful!", {
        description: `Welcome back, ${username}!`,
      });

      // Determine where to redirect based on userType
      const userType = getUserType(); // admin, merchant, or other
      if (userType === "admin") {
        router.push("/admin");
      } else if (userType === "merchant") {
        router.push("/merchant");
      } else {
        router.push("/"); // default route for other users
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Invalid username or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
