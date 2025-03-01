"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginState, useUser } from "@/app/hooks/useUser";

export default function LoginPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useUser();
  const [loginState, setLoginState] = useState<LoginState | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const loginState = await login(username, password);
    if (loginState === "success") {
      router.push("/");
    } else {
      setLoginState(loginState);
    }
  };

  return (
    <div className="mdsnip-container">
      <div className={styles.registerPage}>
        <div className={styles.registerContainer}>
          <div className={styles.titleContainer}>
            <Image
              width={100}
              height={100}
              src={"/mdsnip.png"}
              alt="mdsnip logo"
            />
            <h1 className={styles.title}>Sign in to your account</h1>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formElement}>
              <label>Username</label>
              <input ref={usernameRef} required className="mdsnip-input" />
            </div>
            <div className={styles.formElement}>
              <label>Password</label>
              <input
                type="password"
                ref={passwordRef}
                required
                className="mdsnip-input"
              />
            </div>
            <div className={styles.btnContainer}>
              {loginState === "wrong" ? (
                <p>Wrong username or password</p>
              ) : null}
              <button type="submit" className="mdsnip-button">
                Sign In
              </button>
            </div>
          </form>
          <p className={styles.already}>
            Dont have an account?{" "}
            <Link href={"/register"} className={styles.link}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
