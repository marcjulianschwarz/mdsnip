import styles from "./dropdown.module.css";

export interface DropdownComponentProps {
  setIsOpen: (open: boolean) => void;
  items: {
    label: string;
    onClick?: (() => Promise<void>) | (() => void);
    type?: DropDownItemType;
  }[];
}

export enum DropDownItemType {
  DESTROY,
  WARNING,
}

export default function DropdownComponent(props: DropdownComponentProps) {
  const { items, setIsOpen } = props;
  return (
    <div className={styles.menu}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.item} ${
            item.type == DropDownItemType.DESTROY ? styles.destroy : ""
          } ${item.type == DropDownItemType.WARNING ? styles.warning : ""}`}
          onClick={async () => {
            await item.onClick?.();
            setIsOpen(false);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
