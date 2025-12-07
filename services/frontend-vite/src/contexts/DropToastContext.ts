import type { DropToastStyle } from "@/components/DropToast/DropToastStyle";
import { createContext } from "react";

interface DropToastContextType {
  isOpen: boolean;
  text: string;
  contentKey: string | null;
  showDropToast: (
    text: string,
    key: string,
    time: number,
    style?: DropToastStyle,
  ) => void;
  style?: DropToastStyle;
}

export const DropToastContext = createContext<DropToastContextType | undefined>(
  undefined,
);
