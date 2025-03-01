import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";
import { useState } from "react";
import PersonIcon from "@/app/icons/PersonIcon";
import { useUser } from "@/app/hooks/useUser";
import { useClickOutside } from "@/app/hooks/useClickOutside";

interface SidebarItem {
  name: string;
  link: string;
  icon: React.ReactNode;
}

function AccountFlyout({
  showFlyout,
  onNavigate,
}: {
  showFlyout: boolean;
  onNavigate: () => void;
}) {
  const { auth, logout } = useUser();

  const handleLogout = async () => {
    onNavigate();
    await logout();
  };

  return (
    <div className={`${styles.flyout} ${showFlyout ? styles.show : ""}`}>
      {auth.user ? (
        <>
          <Link
            onClick={onNavigate}
            href={"/account"}
            className={styles.flyoutEntry}
          >
            <p>Account</p>
          </Link>

          <Link
            onClick={handleLogout}
            href={"/"}
            className={styles.flyoutEntry}
          >
            <p>Logout</p>
          </Link>
        </>
      ) : (
        <>
          <Link
            onClick={onNavigate}
            href={"/login"}
            className={styles.flyoutEntry}
          >
            <p>Login</p>
          </Link>

          <Link
            onClick={onNavigate}
            href={"/register"}
            className={styles.flyoutEntry}
          >
            <p>Sign Up</p>
          </Link>
        </>
      )}
    </div>
  );
}

function SidebarItem(props: { item: SidebarItem }) {
  const pathname = usePathname();
  const isActive = pathname === props.item.link;

  return (
    <Link
      className={`${styles.item} ${isActive ? styles.active : ""}`}
      href={props.item.link}
    >
      {props.item.icon}
      {/* <Image
        src={`/${props.item.icon}.svg`}
        alt={props.item.name}
        width={32}
        height={32}
      /> */}
    </Link>
  );
}

export default function Sidebar(props: { items: SidebarItem[] }) {
  const [showFlyout, setShowFlyout] = useState(false);
  const containerRef = useClickOutside(() => setShowFlyout(false));

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFlyout(!showFlyout);
  };

  const { auth } = useUser();

  return (
    <>
      <div className={styles.sidebarPlaceholder}></div>

      <div className={styles.sidebar}>
        <div className={styles.content}>
          {props.items.map((item) => (
            <SidebarItem item={item} key={item.name} />
          ))}

          <div className={styles.usercontainer} ref={containerRef}>
            <div className={styles.item} onClick={handleUserClick}>
              {auth.user ? (
                <p className={styles.userIcon}>
                  {auth.user.username[0].toUpperCase()}
                </p>
              ) : (
                <PersonIcon />
              )}
            </div>
            <AccountFlyout
              showFlyout={showFlyout}
              onNavigate={() => setShowFlyout(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
