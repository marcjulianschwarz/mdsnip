import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./sidebar-provider.module.css";
import DropToast from "@/components/DropToast/DropToast";
import { HomeIcon, GridIcon, SettingsIcon } from "lucide-react";

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.sidebarContainer}>
      <DropToast></DropToast>
      <Sidebar
        items={[
          {
            name: "Home",
            icon: <HomeIcon />,
            link: "/",
          },
          {
            name: "Snippets",
            icon: <GridIcon />,
            link: "/snippets",
          },
          {
            name: "Settings",
            icon: <SettingsIcon />,
            link: "/settings",
          },
        ]}
      />
      {children}
    </div>
  );
}
