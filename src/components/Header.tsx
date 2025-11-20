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
} from "lucide-react";
import { getAuthToken, getUserType, logout } from "@/lib/apiUtils";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl text-blue-600 font-bold">
          dudu
        </Link>
        <nav className="flex items-center gap-6">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-text hover:text-primary text-sm"
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex flex-col items-center text-text hover:text-primary text-sm"
            >
              <LogOut className="w-5 h-5 mb-1" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center text-text hover:text-primary text-sm"
            >
              <LogIn className="w-5 h-5 mb-1" />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
