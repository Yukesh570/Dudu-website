"use client";

import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col p-4"
        style={{
          backgroundColor: "var(--color-sidebar)",
          color: "var(--color-sidebar-foreground)",
        }}
      >
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          {[
            { label: "Dashboard", href: "/admin" },
            { label: "Users", href: "/admin/users" },
            { label: "Services", href: "/admin/services" },
            { label: "Reports", href: "/admin/reports" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md transition-colors"
              style={{
                color: "var(--color-sidebar-foreground)",
              }}
            >
              <span className="hover-link">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-6"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-card-foreground)",
        }}
      >
        {children}
      </main>

      <style jsx>{`
        .hover-link {
          display: inline-block;
          width: 100%;
          transition: color 0.2s ease, background-color 0.2s ease;
        }

        .hover-link:hover {
          background-color: var(--color-muted);
          color: var(--color-sidebar-primary);
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
}
