import styles from "./drop-toast-container.module.css";
import { createContext, useContext, useRef, useState } from "react";
import DropToastComponent from "./DropToastComponent";

interface DropToastContextType {
  isOpen: boolean;
  text: string;
  contentKey: string | null;
  showDropToast: (
    text: string,
    key: string,
    time: number,
    style?: DropToastStyle
  ) => void;
  style?: DropToastStyle;
}

const DropToastContext = createContext<DropToastContextType | undefined>(
  undefined
);

export enum DropToastStyle {
  Warning = "warning",
  Success = "success",
}

export function DropToastProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<string>("");
  const [style, setStyle] = useState<DropToastStyle>();
  const [contentKey, setContentKey] = useState<string | null>(null);
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const showDropToast = (
    newContent: string,
    key: string,
    time: number,
    style?: DropToastStyle
  ) => {
    if (timeouts.current[key]) {
      clearTimeout(timeouts.current[key]);
      delete timeouts.current[key];
    }

    setStyle(style);
    setContent(newContent);
    setContentKey(key);
    setIsOpen(true);

    timeouts.current[key] = setTimeout(() => {
      setIsOpen(false);
      delete timeouts.current[key];
    }, time);
  };

  return (
    <DropToastContext.Provider
      value={{
        isOpen,
        text: content,
        contentKey,
        showDropToast,
        style,
      }}
    >
      {props.children}
    </DropToastContext.Provider>
  );
}

export const useDropToast = () => {
  const context = useContext(DropToastContext);
  if (context === undefined) {
    throw new Error("useDropToast must be used within a DropToastProvider");
  }
  return context;
};

export default function DropToast() {
  const { text, isOpen, style } = useDropToast();

  return (
    <div className={styles.container}>
      <DropToastComponent text={text} isOpen={isOpen} style={style} />
    </div>
  );
}
