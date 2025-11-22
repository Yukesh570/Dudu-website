"use client";

import { ReactNode, useEffect, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  const formattedTitle = lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const [open, setOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      setIsDesktop(mq.matches);
      setOpen(mq.matches);
    };
    apply();
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      setOpen(e.matches);
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const [openMenu, setOpenMenu] = useState<string>("");
  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? "" : label));
  };

  const menuItems = [
    {
      href: "/merchant",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      href: "/merchant/orders",
      label: "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      sub: [
        { href: "/merchant/products", label: "Collections" },
        { href: "/merchant/inventory", label: "Inventory" },
      ],
    },
    {
      href: "/merchant/customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      href: "/merchant/analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      href: "/merchant/payments",
      label: "Payments",
      icon: <Tag className="w-5 h-5" />,
    },
    {
      href: "/merchant/explore",
      label: "Explore",
      icon: <Tag className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`
          relative z-30 flex flex-col h-full bg-gray-100 border-r transition-all duration-200 ease-in-out
          ${open ? "w-64" : "w-16"}
          md:block
        `}
      >
        <div
          className={`
            flex items-center gap-2 p-4 border-b bg-gray-100
            ${open ? "justify-between" : "justify-center"}
          `}
        >
          {open && <h2 className="text-lg font-bold">Merchant Panel</h2>}

          {/* Toggle */}
          <button
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring"
          >
            {open ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item) => (
            <div key={item.label} className="mb-1">
              {!item.sub ? (
                <Link
                  href={item.href!}
                  className={`
                    group relative flex items-center gap-3 p-2 rounded-md transition-colors
                    hover:bg-gray-200
                    ${pathname === item.href ? "bg-gray-300 font-medium" : ""}
                    ${open ? "justify-start" : "justify-center"}
                  `}
                  title={open ? undefined : item.label}
                >
                  <span
                    className="w-6 h-6 flex items-center justify-center"
                    aria-hidden
                  >
                    {item.icon}
                  </span>

                  {/* label  */}
                  <span className={`${open ? "block" : "hidden"} truncate`}>
                    {item.label}
                  </span>

                  {/* Tooltip */}
                  {!open && (
                    <span
                      className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-sm bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      role="tooltip"
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`
                      group relative flex items-center gap-3 p-2 w-full rounded-md transition-colors
                      hover:bg-gray-200
                      ${open ? "justify-between" : "justify-center"}
                    `}
                    title={open ? undefined : item.label}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className={`${open ? "block" : "hidden"} truncate`}>
                        {item.label}
                      </span>
                    </div>

                    {open && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openMenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}

                    {!open && (
                      <span
                        className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-sm bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        role="tooltip"
                      >
                        {item.label}
                      </span>
                    )}
                  </button>

                  {open && openMenu === item.label && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 text-sm">
                      {item.sub!.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`p-1 rounded-md hover:bg-gray-200 ${
                            pathname === subItem.href ? "font-medium" : ""
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Button mobile*/}
      {!isDesktop && !open && (
        <button
          className="fixed left-2 bottom-6 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border shadow-lg"
          aria-label="Open sidebar"
          onClick={() => setOpen(true)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

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
