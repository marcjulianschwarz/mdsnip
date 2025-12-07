import styles from "./drop-toast.module.css";
import type { DropToastStyle } from "./DropToastStyle";

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
  switch (style) {
    case "warning": {
      styleClass = styles.toastWarning;
      break;
    }
    case "success": {
      styleClass = styles.toastSuccess;
      break;
    }
  }

  return (
    <div
      className={`${styles.toast} ${styleClass} ${
        isOpen ? styles.visible : ""
      }`}
    >
      <p className={styles.text}>{text}</p>
    </div>
  );
}
