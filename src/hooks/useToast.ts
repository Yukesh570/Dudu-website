"use client";

import { toast } from "sonner";

export function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
    });
  };

  return { showSuccess, showError, showInfo };
}
