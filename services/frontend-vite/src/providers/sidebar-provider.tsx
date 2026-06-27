import TopBar from "@/components/TopBar/TopBar";
import styles from "./sidebar-provider.module.css";
import DropToast from "@/components/DropToast/DropToast";

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.appContainer}>
      <DropToast />
      <TopBar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
