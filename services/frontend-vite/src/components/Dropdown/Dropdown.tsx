import styles from "./dropdown-container.module.css";
import DropdownComponent, { DropDownItemType } from "./DropdownComponent";

export interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: {
    label: string;
    onClick?: (() => Promise<void>) | (() => void);
    type?: DropDownItemType;
  }[];
}

export function Dropdown({ isOpen, setIsOpen, items }: DropdownProps) {
  return (
    <div className={styles.container}>
      {isOpen ? (
        <DropdownComponent setIsOpen={setIsOpen} items={items} />
      ) : null}
    </div>
  );
}
