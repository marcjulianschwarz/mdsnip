import type { DropToastStyle } from "@/components/DropToast/DropToastStyle";
import { DropToastContext } from "@/contexts/DropToastContext";
import { useState, useRef } from "react";

export function DropToastProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<string>("");
  const [style, setStyle] = useState<DropToastStyle>();
  const [contentKey, setContentKey] = useState<string | null>(null);
  const timeouts = useRef<Record<string, number>>({});

  const showDropToast = (
    newContent: string,
    key: string,
    time: number,
    style?: DropToastStyle,
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
