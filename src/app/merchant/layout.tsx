"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  const formattedTitle = lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col p-4 border-r"
        style={{
          backgroundColor: "var(--color-sidebar)",
          color: "var(--color-sidebar-foreground)",
          borderColor: "var(--color-sidebar-border)",
        }}
      >
        <h2 className="text-xl font-bold mb-6">Merchant Panel</h2>
        <nav className="flex flex-col gap-2">
          {[
            { href: "/merchant", label: "Dashboard" },
            { href: "/merchant/products", label: "Products" },
            { href: "/merchant/payments", label: "Payments" },
            { href: "/merchant/orders", label: "Orders" },
            { href: "/merchant/explore", label: "Explore" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-2 rounded-md transition-colors"
              style={{
                color: "var(--color-sidebar-foreground)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-background)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 p-6"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
        }}
      >
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/merchant">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formattedTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {children}
      </main>
    </div>
  );
}
