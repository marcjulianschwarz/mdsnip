import styles from "./snippets-view.module.css";
import SnippetView from "./SnippetView";
import { type User } from "@/services/auth.service";
import { useSnippets } from "@/hooks/useSnippets";
import { Link } from "react-router";

export default function SnippetsView({ user }: { user: User }) {
  const { data, isError, isPending } = useSnippets(user.id);

  if (isPending) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Could not load snippets</div>;
  }

  return (
    <>
      {data.length == 0 ? (
        <p>
          No snippets created yet. <Link to={"/"}>Create one.</Link>
        </p>
      ) : (
        <div className={styles.snippetsContainer}>
          <div className={styles.snippets}>
            {data.map((snippet) => (
              <SnippetView key={snippet.shareCode} snippet={snippet} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
