"use client";
import GridIcon from "@/app/icons/GridIcon";
import Sidebar from "../../components/Sidebar/Sidebar";
import HomeIcon from "../../icons/HomeIcon";
import SettingsIcon from "../../icons/SettingsIcon";
import styles from "./sidebar-provider.module.css";
import DropToast from "@/app/components/DropToast/DropToast";

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
