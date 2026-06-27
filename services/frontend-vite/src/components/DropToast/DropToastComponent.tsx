import styles from "./drop-toast.module.css";
import type { DropToastStyle } from "./DropToastStyle";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function DropToastComponent({
  isOpen,
  style,
  text,
}: {
  isOpen: boolean;
  style?: DropToastStyle;
  text: string;
}) {
  let styleClass = "";
  let icon = <Info width={16} height={16} />;
  switch (style) {
    case "warning":
      styleClass = styles.toastWarning;
      icon = <AlertCircle width={16} height={16} />;
      break;
    case "success":
      styleClass = styles.toastSuccess;
      icon = <CheckCircle2 width={16} height={16} />;
      break;
  }

  return (
    <div
      className={`${styles.toast} ${styleClass} ${
        isOpen ? styles.visible : ""
      }`}
      role="status"
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
