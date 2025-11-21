"use client";

import { ReactNode, useState } from "react";
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

import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Tag,
  ChevronDown,
} from "lucide-react";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  const formattedTitle = lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const [openMenu, setOpenMenu] = useState<string>("");

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? "" : label));
  };

  const menuItems = [
    {
      href: "/merchant",
      label: "Dashboard",
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: "/merchant/orders",
      label: "Orders",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      label: "Products",
      icon: <Package className="w-4 h-4" />,
      sub: [
        { href: "/merchant/products", label: "Collections" },
        { href: "/merchant/inventory", label: "Inventory" },
      ],
    },
    {
      href: "/merchant/customers",
      label: "Customers",
      icon: <Users className="w-4 h-4" />,
    },
    {
      href: "/merchant/analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      href: "/merchant/payments",
      label: "Payments",
      icon: <Tag className="w-4 h-4" />,
    },
    {
      href: "/merchant/explore",
      label: "Explore",
      icon: <Tag className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 flex flex-col border-r bg-gray-100 text-gray-900 h-full overflow-y-auto">
        <div className="p-4 sticky top-0 bg-gray-100 z-10 border-b border-gray-200">
          <h2 className="text-xl font-bold">Merchant Panel</h2>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              {/* If item has sub menu, DO NOT navigate */}
              {item.sub ? (
                <div
                  onClick={() => toggleMenu(item.label)}
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-gray-200 ${
                    pathname === item.href ? "bg-gray-300 font-medium" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}

              {/* Submenu */}
              {item.sub && openMenu === item.label && (
                <div className="ml-8 mt-1 flex flex-col gap-1 text-sm">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${
                        pathname === subItem.href
                          ? "font-medium text-black"
                          : ""
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/merchant">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{formattedTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {children}
        </div>
      </main>
    </div>
  );
}
