import styles from "./page.module.css";
import HTMLContent from "@/components/HTMLContent/HTMLContent";
import { useParams } from "react-router";

export default function SharePage() {
  const { shareId } = useParams();

  if (!shareId) return <p>No share id</p>;

  return (
    <div className={styles.htmlContainer}>
      <HTMLContent slug={shareId} />
    </div>
  );
}
