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
    <div className="mdsnip-container">
      <div className={styles.registerPage}>
        <div className={styles.registerContainer}>
          <div className={styles.titleContainer}>
            <img
              width={100}
              height={100}
              src={"/mdsnip.png"}
              alt="mdsnip logo"
            />
            <h1 className={styles.title}>Create an account</h1>
          </div>
          <p className={styles.description}>
            A mdsnip account allows you to better manage your created snippets.
            Creating an account is not required to use this app.
          </p>
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
              {userExists ? <p>Username already taken</p> : null}
              <button type="submit" className="mdsnip-button">
                Sign Up
              </button>
            </div>
          </form>
          <p className={styles.already}>
            Already have an account?{" "}
            <Link to={"/login"} className={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
