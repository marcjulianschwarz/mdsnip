import styles from "./page.module.css";
import { useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router";
import { useDropToast } from "@/hooks/useDropToast";

export default function RegisterPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [userExists, setUserExists] = useState<boolean>(false);

  const navigate = useNavigate();
  const { register } = useUser();
  const { showDropToast } = useDropToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    const user = await register(username, password);
    if (user) {
      setUserExists(false);
      showDropToast(`Welcome ${username}`, "welcome", 2000, "success");
      navigate("/");
    } else {
      setUserExists(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>
            Manage your snippets. Account is optional.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Username</span>
            <input
              ref={usernameRef}
              required
              autoComplete="username"
              className={styles.input}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              type="password"
              ref={passwordRef}
              required
              autoComplete="new-password"
              className={styles.input}
            />
          </label>

          {userExists && (
            <p className={styles.error}>Username already taken.</p>
          )}

          <button type="submit" className={styles.submit}>
            Sign up
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
