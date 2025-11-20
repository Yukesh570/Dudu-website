"use client";

import { useEffect, useState } from "react";
import { getUserType } from "@/lib/authUtils";

export function useAuth() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentUserType = getUserType();
      setUserType(currentUserType);
    };

    // Check immediately
    checkAuth();

    // Listen for storage events (like when token is cleared in another tab/window)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom logout event
    const handleLogout = () => {
      setUserType(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return { 
    userType, 
    isAdmin: userType === "admin", 
    isMerchant: userType === "merchant", 
    isBuyer: userType === "buyer" 
  };
}