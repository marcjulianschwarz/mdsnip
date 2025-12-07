import { useDropToast } from "@/hooks/useDropToast";
import styles from "./drop-toast-container.module.css";
import DropToastComponent from "./DropToastComponent";

export default function DropToast() {
  const { text, isOpen, style } = useDropToast();

  return (
    <div className={styles.container}>
      <DropToastComponent text={text} isOpen={isOpen} style={style} />
    </div>
  );
}
