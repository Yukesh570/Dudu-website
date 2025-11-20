"use client";

export default function AdminDashboard() {
  return (
    <div
      className="p-6 rounded-lg shadow"
      style={{
        backgroundColor: "var(--color-card)",
        color: "var(--color-card-foreground)",
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome to the Admin Panel. Manage users, services, and reports here.
      </p>

      <div
        className="mt-8 border-2 border-dashed rounded-lg p-10 text-center"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-muted)",
          color: "var(--color-muted-foreground)",
        }}
      >
        Admin analytics, stats, or charts will appear here.
      </div>
    </div>
  );
}
