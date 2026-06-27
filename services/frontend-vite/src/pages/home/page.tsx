import { useRef, useState } from "react";
import styles from "./page.module.css";
import { usePreferences } from "@/hooks/usePreferences";
import { useUser } from "@/hooks/useUser";
import { useCreateSnippet } from "@/hooks/useCreateSnippet";
import { useNavigate } from "react-router";
import { useDropToast } from "@/hooks/useDropToast";
import SnippetsView from "../snippets/SnippetsView";
import { Settings2 } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import hljs from "highlight.js";

const CODE_LANG_SUBSET = [
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "java",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "bash",
  "shell",
  "sql",
  "json",
  "yaml",
  "xml",
  "html",
  "css",
  "scss",
  "markdown",
  "dockerfile",
];

const detectLanguage = (text: string): string => {
  const trimmed = text.trim();
  if (trimmed.length < 8) return "";
  const result = hljs.highlightAuto(trimmed, CODE_LANG_SUBSET);
  if (!result.language || (result.relevance ?? 0) < 5) return "";
  return result.language;
};

export default function HomePage() {
  const { preferences } = usePreferences();

  const [markdownInput, setMarkdownInput] = useState("");
  const [expirationHoursInput, setExpirationHoursInput] = useState(
    preferences?.defaultExpirationTime?.toString() || "",
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useClickOutside(() => setShowSettings(false));
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();
  const { showDropToast } = useDropToast();
  const { auth } = useUser();
  const createSnippet = useCreateSnippet({
    onSuccess: () => {
      showDropToast("Snippet created", "share", 2000, "success");
      setMarkdownInput("");
    },
    onError: () => {
      showDropToast("Error creating snippet", "shareError", 2000, "warning");
    },
  });

  const maybeWrapAsCodeBlock = (text: string) => {
    if (/```/.test(text)) return text;
    const lang = detectLanguage(text);
    if (!lang) return text;
    return "```" + lang + "\n" + text.replace(/\n+$/, "") + "\n```";
  };

  const handleShare = async () => {
    if (!markdownInput.trim()) return;

    const expirationHours = expirationHoursInput
      ? parseInt(expirationHoursInput)
      : undefined;

    const markdown = maybeWrapAsCodeBlock(markdownInput);

    const snippet = await createSnippet.mutateAsync({
      markdown,
      userId: auth.user?.id,
      expirationHours: expirationHours,
      password: passwordInput.trim() || undefined,
    });

    setPasswordInput("");

    const shareUrl =
      import.meta.env.VITE_FRONTEND_URL + "/share/" + snippet.shareCode;

    try {
      await navigator.clipboard.writeText(shareUrl);
      showDropToast("Copied Link", "copylink", 2000);
    } catch {
      showDropToast("Could not copy link", "nocopylink", 2000, "warning");
    }

    if (preferences?.defaultShareAction === "snippets") return;

    navigate("/share/" + snippet.shareCode);
  };

  return (
    <div className={styles.page}>
      <section className={styles.composer}>
        <textarea
          onChange={(e) => setMarkdownInput(e.target.value)}
          value={markdownInput}
          className={styles.input}
          placeholder="Paste or type markdown…"
          tabIndex={1}
          autoFocus
        />

        <div className={styles.actions}>
          <div className={styles.settingsWrap} ref={settingsRef}>
            <button
              ref={buttonRef}
              type="button"
              className={styles.iconButton}
              onClick={() => setShowSettings((v) => !v)}
              aria-label="Snippet settings"
              aria-expanded={showSettings}
            >
              <Settings2 width={16} height={16} />
            </button>
            {showSettings && (
              <div className={styles.settingsPopover} role="dialog">
                {auth.isAuthenticated && (
                  <>
                    <label htmlFor="exp" className={styles.popoverLabel}>
                      Expires in (hours)
                    </label>
                    <input
                      id="exp"
                      className={styles.popoverInput}
                      onChange={(e) => setExpirationHoursInput(e.target.value)}
                      value={expirationHoursInput}
                      placeholder="24"
                    />
                  </>
                )}
                <label htmlFor="pw" className={styles.popoverLabel}>
                  Password (optional)
                </label>
                <input
                  id="pw"
                  type="password"
                  name="snippet-passcode"
                  className={styles.popoverInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  value={passwordInput}
                  placeholder="Leave empty for public"
                  autoComplete="off"
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className={styles.shareButton}
            disabled={!markdownInput.trim() || createSnippet.isPending}
            tabIndex={3}
          >
            Share
          </button>
        </div>
      </section>

      {auth.isAuthenticated && auth.user && (
        <section className={styles.snippetsSection}>
          <SnippetsView user={auth.user} />
        </section>
      )}
    </div>
  );
}
