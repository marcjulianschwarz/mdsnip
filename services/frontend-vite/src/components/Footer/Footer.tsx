import { Link } from "react-router";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <Link to="/privacy/impressum">Impressum</Link>
      <p>|</p>
      <Link to="/privacy/data">Datenschutzerklärung</Link>
    </div>
  );
}
