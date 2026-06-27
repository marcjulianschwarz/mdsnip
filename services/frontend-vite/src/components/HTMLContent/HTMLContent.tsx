import { useQuery } from "@tanstack/react-query";
import { type Snippet, SnippetService } from "../../services/snippets.service";
import MarkdownComponent from "./MarkdownComponent";
import { downloadHtml, downloadMarkdown } from "@/services/markdown";
import { useState } from "react";
import styles from "./html-content.module.css";
import {
  Download,
  FileCode2,
  Clock,
  Plus,
  Lock,
  Copy,
  Loader2,
} from "lucide-react";
import { Link, Navigate } from "react-router";
import { Modal } from "../Modal/Modal";
import { useDropToast } from "@/hooks/useDropToast";

type MarkdownHTMLResponse =
  | { expired: true }
  | { notFound: true }
  | { protected: true }
  | { snippet: Snippet; expired: false };

const FAKE_BLUR_MARKDOWN = `# Lorem ipsum dolor sit amet

Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. **Ut enim ad minim veniam**, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Sed do eiusmod

- Duis aute irure dolor in reprehenderit
- Excepteur sint occaecat cupidatat non proident
- Sunt in culpa qui officia deserunt mollit anim

\`\`\`javascript
function lorem(ipsum) {
  const dolor = sit.amet(consectetur);
  return adipiscing.elit(dolor);
}
\`\`\`

> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function HTMLContent({ slug }: { slug: string }) {
  const [html, setHtml] = useState<string>("");
  const [unlockedSnippet, setUnlockedSnippet] = useState<Snippet | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [shake, setShake] = useState(false);
  const { showDropToast } = useDropToast();

  const copyMarkdown = async (markdown: string) => {
    try {
      await navigator.clipboard.writeText(markdown);
      showDropToast("Copied Markdown", "copymd", 2000);
    } catch {
      showDropToast("Could not copy", "nocopymd", 2000, "warning");
    }
  };

  const { data, isPending, isError } = useQuery<MarkdownHTMLResponse>({
    throwOnError: true,
    queryKey: ["markdown", slug],
    queryFn: async () => {
      const response = await SnippetService.getByShareCode(slug);
      if (!response) throw new Error("Fetching failed");
      if ("notFound" in response) return { notFound: true };
      if ("protected" in response) return { protected: true };
      if (response.expired) return { expired: true };

      return { snippet: response.snippet, expired: false };
    },
    retry: false,
  });

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    setUnlocking(true);
    setUnlockError(null);
    try {
      const result = await SnippetService.unlock(slug, passwordInput);
      if (result === "invalid") {
        setShake(true);
        setPasswordInput("");
        setTimeout(() => setShake(false), 500);
      } else if (result) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setUnlockedSnippet(result);
      } else {
        setUnlockError("Unable to unlock. Try again.");
      }
    } finally {
      setUnlocking(false);
    }
  };

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error Loading Snippet. Try again later.</p>;
  if ("notFound" in data) return <Navigate to="/" replace />;
  if ("protected" in data && !unlockedSnippet) {
    return (
      <>
        <article className={styles.article} aria-hidden="true">
          <div className={styles.blurred}>
            <MarkdownComponent
              markdown={FAKE_BLUR_MARKDOWN}
              htmlGenerated={() => {}}
            />
          </div>
        </article>
        <Modal isOpen={true} size="sm" shake={shake}>
          <form
            className={`${styles.unlockForm} ${styles.unlockFormSizer}`}
            onSubmit={handleUnlock}
          >
            <div className={styles.unlockIcon} aria-hidden="true">
              <Lock width={18} height={18} />
            </div>
            <h2 className={styles.unlockTitle}>Password required</h2>
            <p className={styles.unlockText}>
              This snippet is protected. Enter the password to view it.
            </p>
            <input
              type="text"
              name="snippet-passcode"
              className={`${styles.unlockInput} ${styles.maskedInput} ${shake ? styles.inputError : ""}`}
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setUnlockError(null);
              }}
              placeholder="Password"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              data-1p-ignore="true"
              data-lpignore="true"
              data-bwignore="true"
              data-form-type="other"
            />
            {unlockError && (
              <p className={styles.unlockError} role="alert">
                {unlockError}
              </p>
            )}
            <button
              type="submit"
              className={styles.unlockButton}
              disabled={!passwordInput || unlocking}
            >
              {unlocking ? (
                <span className={styles.unlockButtonInner}>
                  <Loader2
                    className={styles.spinner}
                    width={14}
                    height={14}
                  />
                  <span>Unlocking…</span>
                </span>
              ) : (
                "Unlock"
              )}
            </button>
          </form>
        </Modal>
      </>
    );
  }

  const snippet =
    unlockedSnippet ?? ("snippet" in data ? data.snippet : null);

  if ("expired" in data && data.expired)
    return (
      <div className={styles.expired} role="status">
        <div className={styles.expiredIcon} aria-hidden="true">
          <Clock width={28} height={28} />
        </div>
        <h1 className={styles.expiredTitle}>This snippet has expired</h1>
        <p className={styles.expiredText}>
          The link you followed is no longer available. Snippets vanish after
          their expiration time, so nothing lingers longer than it should.
        </p>
        <Link to="/" className={styles.expiredCta}>
          <Plus width={16} height={16} />
          <span>Create a new snippet</span>
        </Link>
      </div>
    );

  if (!snippet) return null;

  return (
    <article className={styles.article}>
      <header className={styles.meta}>
        <time
          className={styles.date}
          dateTime={new Date(snippet.createdAt).toISOString()}
        >
          {formatDate(snippet.createdAt)}
        </time>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => copyMarkdown(snippet.markdown)}
            aria-label="Copy markdown"
          >
            <Copy width={14} height={14} />
            <span>Copy</span>
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => downloadMarkdown(snippet.markdown)}
            aria-label="Download markdown"
          >
            <FileCode2 width={14} height={14} />
            <span>Markdown</span>
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => downloadHtml(html)}
            aria-label="Download HTML"
          >
            <Download width={14} height={14} />
            <span>HTML</span>
          </button>
        </div>
      </header>
      <MarkdownComponent
        markdown={snippet.markdown}
        htmlGenerated={setHtml}
      />
    </article>
  );
}

export default HTMLContent;
