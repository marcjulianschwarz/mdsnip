import { DropToastContext } from "@/contexts/DropToastContext";
import { useContext } from "react";

export const useDropToast = () => {
  const context = useContext(DropToastContext);
  if (context === undefined) {
    throw new Error("useDropToast must be used within a DropToastProvider");
  }
  return context;
};
