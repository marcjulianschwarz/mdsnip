import { useState } from "react";
import styles from "./page.module.css";
import { usePreferences } from "@/hooks/usePreferences";
import { useUser } from "@/hooks/useUser";
import { useCreateSnippet } from "@/hooks/useCreateSnippet";
import { useNavigate } from "react-router";
import { useDropToast } from "@/hooks/useDropToast";

export default function HomePage() {
  const { preferences } = usePreferences();

  const [markdownInput, setMarkdownInput] = useState("");
  const [expirationHoursInput, setExpirationHoursInput] = useState(
    preferences?.defaultExpirationTime?.toString() || "",
  );
  const navigate = useNavigate();
  const { showDropToast } = useDropToast();
  const { auth } = useUser();
  const createSnippet = useCreateSnippet({
    onSuccess: () => {
      showDropToast("Snippet created", "share", 2000, "success");
    },
    onError: () => {
      showDropToast("Error creating snippet", "shareError", 2000, "warning");
    },
  });

  const handleShareMe = async () => {
    const expirationHours = expirationHoursInput
      ? parseInt(expirationHoursInput)
      : undefined;

    const snippet = await createSnippet.mutateAsync({
      markdown: markdownInput,
      userId: auth.user?.id,
      expirationHours: expirationHours,
    });

    if (preferences?.defaultShareAction === "view") {
      navigate(
        import.meta.env.VITE_FRONTEND_URL + "/share/" + snippet.shareCode,
      );
    } else if (preferences?.defaultShareAction === "snippets") {
      navigate("/snippets");
    } else {
      navigate(
        import.meta.env.VITE_FRONTEND_URL + "/share/" + snippet.shareCode,
      );
    }
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdownInput(newMarkdown);
  };

  const handleExpirationHoursChange = (newExpirationHours: string) => {
    setExpirationHoursInput(newExpirationHours);
  };

  return (
    <div className="mdsnip-container">
      <div className={styles.header}>
        <h1>Share your markdown snippets</h1>
        <p>
          Enter markdown, click share, copy link. It is <strong>that</strong>{" "}
          easy.
        </p>
      </div>
      <div className={styles.inputContainer}>
        <textarea
          onChange={(e) => handleMarkdownChange(e.target.value)}
          value={markdownInput}
          className={styles.input}
          placeholder="Enter **markdown** here..."
          tabIndex={1}
          autoFocus={true}
        />
      </div>

      {auth.isAuthenticated && (
        <div className={styles.settingsContainer}>
          <label>Expiration Time (hours):</label>
          <input
            className="mdsnip-input"
            onChange={(e) => handleExpirationHoursChange(e.target.value)}
            value={expirationHoursInput}
            placeholder="24"
            tabIndex={2}
          ></input>
        </div>
      )}
      <button
        onClick={handleShareMe}
        className={`mdsnip-button ${styles.shareButton}`}
        tabIndex={3}
      >
        Share me!
      </button>
    </div>
  );
}
