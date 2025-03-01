import styles from "./drop-toast.module.css";

export enum DropToastStyle {
  Warning = "warning",
  Success = "success",
}

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
    case DropToastStyle.Warning: {
      styleClass = styles.toastWarning;
      break;
    }
    case DropToastStyle.Success: {
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
