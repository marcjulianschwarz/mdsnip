import styles from "./snippets-view.module.css";
import SnippetView from "./SnippetView";
import { type User } from "@/services/auth.service";
import { useSnippets } from "@/hooks/useSnippets";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function SnippetsView({ user }: { user: User }) {
  const { data, isError, isPending } = useSnippets(user.id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSnippets = useMemo(() => {
    if (!data) return [];

    return data.filter(
      (snippet) =>
        snippet.shareCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.markdown?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

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
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`mdsnip-input ${styles.searchBar}`}
            placeholder="Search..."
          />
          <div className={styles.snippets}>
            {filteredSnippets.map((snippet) => (
              <SnippetView key={snippet.shareCode} snippet={snippet} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
