"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  User,
  LogOut,
  LogIn,
  Store,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { getAuthToken, getUserType, logout } from "@/lib/apiUtils";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
    setUserType(getUserType());
  }, []);

  const customerMenu = [
    { name: "Home", href: "/", icon: Home },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const merchantMenu = [
    { name: "Dashboard", href: "/merchant", icon: Store },
    { name: "Products", href: "/merchant/products", icon: Package },
    { name: "Payments", href: "/merchant/payments", icon: ShoppingCart },
  ];

  const adminMenu = [
    { name: "Admin Panel", href: "/admin", icon: Shield },
    { name: "Users", href: "/admin/users", icon: User },
  ];

  const menu =
    userType === "merchant"
      ? merchantMenu
      : userType === "admin"
      ? adminMenu
      : customerMenu;

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-xl font-bold flex items-center gap-2"
        >
          <span>DuDu</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <item.icon size={20} className="text-white" />
              {item.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setIsLoggedIn(false);
              }}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <LogOut size={20} className="text-white" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <LogIn size={20} className="text-white" />
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 animate-slideDown">
          <nav className="flex flex-col gap-4 mt-2">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <item.icon size={20} className="text-white" />
                {item.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setIsLoggedIn(false);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-left hover:text-gray-200"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 hover:text-gray-200"
              >
                <LogIn size={20} />
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
