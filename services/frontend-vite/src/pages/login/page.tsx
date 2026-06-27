import { useUser } from "@/hooks/useUser";
import styles from "./page.module.css";
import { useRef, useState } from "react";
import type { LoginState } from "@/contexts/UserContext";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { login } = useUser();
  const [loginState, setLoginState] = useState<LoginState | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const result = await login(username, password);
    if (result === "success") {
      navigate("/");
    } else {
      setLoginState(result);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account.</p>
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
              autoComplete="current-password"
              className={styles.input}
            />
          </label>

          {loginState === "wrong" && (
            <p className={styles.error}>Wrong username or password.</p>
          )}

          <button type="submit" className={styles.submit}>
            Sign in
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
