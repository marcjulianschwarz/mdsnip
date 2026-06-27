import { useUser } from "@/hooks/useUser";
import styles from "./page.module.css";

export default function AccountPage() {
  const { auth, logout } = useUser();

  if (!auth.isAuthenticated) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>You are not signed in.</p>
      </div>
    );
  }

  const initial = auth.user.username[0]?.toUpperCase() ?? "?";

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.profile}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.identity}>
            <p className={styles.username}>@{auth.user.username}</p>
            <p className={styles.handle}>Signed in</p>
          </div>
        </div>

        <div className={styles.divider} />

        <dl className={styles.fields}>
          <div className={styles.field}>
            <dt className={styles.fieldLabel}>Username</dt>
            <dd className={styles.fieldValue}>{auth.user.username}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.footer}>
        <button
          type="button"
          onClick={() => logout()}
          className={styles.dangerButton}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
