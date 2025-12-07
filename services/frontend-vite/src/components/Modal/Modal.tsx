import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      tabIndex={-1}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className={styles.modalHeader}>
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
