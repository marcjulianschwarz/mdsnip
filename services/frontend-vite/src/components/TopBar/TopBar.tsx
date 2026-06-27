import { Link } from "react-router";
import { Settings, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./topbar.module.css";

export default function TopBar() {
  const { auth, logout } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useClickOutside(() => setShowMenu(false));

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
  };

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand}>
        <img
          src="/mdsnip.png"
          alt=""
          width={24}
          height={24}
          className={styles.brandLogo}
        />
        <span>mdsnip</span>
      </Link>

      <div className={styles.actions}>
        <Link
          to="/settings"
          className={styles.iconButton}
          aria-label="Settings"
        >
          <Settings width={18} height={18} />
        </Link>

        <div className={styles.userWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setShowMenu((v) => !v)}
            aria-label="Account"
            aria-expanded={showMenu}
          >
            {auth.user ? (
              <span className={styles.avatar}>
                {auth.user.username[0].toUpperCase()}
              </span>
            ) : (
              <UserIcon width={18} height={18} />
            )}
          </button>

          {showMenu && (
            <div className={styles.menu} role="menu">
              {auth.user ? (
                <>
                  <Link
                    to="/account"
                    className={styles.menuItem}
                    onClick={() => setShowMenu(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={styles.menuItem}
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={styles.menuItem}
                    onClick={() => setShowMenu(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
