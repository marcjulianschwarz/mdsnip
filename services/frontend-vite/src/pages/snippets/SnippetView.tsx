import styles from "./snippets-view.module.css";
import { EllipsisVertical, Lock } from "lucide-react";
import { useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { type Snippet } from "@/services/snippets.service";
import { useDeleteSnippet } from "@/hooks/useDeleteSnippet";
import { Modal } from "@/components/Modal/Modal";
import { useUpdateSnippet } from "@/hooks/useUpdateSnippet";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { useNavigate } from "react-router";
import { useDropToast } from "@/hooks/useDropToast";

function SnippetExpiration({ snippet }: { snippet: Snippet }) {
  if (!snippet.expiresAt) {
    return null;
  }

  //TODO: fix date rerender
  const timeDiff = new Date(snippet.expiresAt).getTime() - Date.now();

  if (timeDiff <= 0) {
    return (
      <div>
        <p className={`${styles.text} ${styles.expired}`}>Expired</p>
      </div>
    );
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0 && minutes === 0) {
    return (
      <div>
        <p className={`${styles.text} ${styles.expired}`}>Less than 1min</p>
      </div>
    );
  }

  const hoursPart = hours > 0 ? `${hours}h` : "";
  const minutesPart = minutes > 0 ? `${minutes}min` : "";
  const separator = hours > 0 && minutes > 0 ? " " : "";

  const timeString = `${hoursPart}${separator}${minutesPart}`.trim();

  return (
    <div>
      <p className={`${styles.text} `}>{timeString}</p>
    </div>
  );
}

export default function SnippetView({ snippet }: { snippet: Snippet }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [snippetToEdit, setSnippetToEdit] = useState<Snippet>();
  const [passwordEdit, setPasswordEdit] = useState<string>("");
  const [passwordDirty, setPasswordDirty] = useState(false);
  const containerRef = useClickOutside(() => setIsDropdownOpen(false));
  const { showDropToast } = useDropToast();
  const deleteSnippet = useDeleteSnippet({
    onSuccess: () =>
      showDropToast("Deleted Snippet", "delete", 2000, "warning"),
    onError: () =>
      showDropToast("Failed to delete snippet.", "failDelete", 2000),
  });

  const updateSnippet = useUpdateSnippet({
    onSuccess: () =>
      showDropToast("Updated Snippet", "update", 2000, "success"),
    onError: () =>
      showDropToast("Failed to delete snippet.", "failUpdate", 2000, "warning"),
  });

  const handleCopy = (snippet: Snippet) => {
    navigator.clipboard
      .writeText(snippet.markdown)
      .then(() => {
        showDropToast("Copied to Clipboard", "copy", 2000);
      })
      .catch(() => {
        showDropToast("Could not be copied", "nocopy", 2000);
      });
  };

  const handleView = (snippet: Snippet) => {
    navigate("/share/" + snippet.shareCode);
  };

  const handleDelete = async (snippet: Snippet) => {
    deleteSnippet.mutate(snippet.id.toString());
  };

  const handleEdit = (snippet: Snippet) => {
    setSnippetToEdit(snippet);
    setPasswordEdit("");
    setPasswordDirty(false);
  };

  const closeEdit = () => {
    setSnippetToEdit(undefined);
    setPasswordEdit("");
    setPasswordDirty(false);
  };

  const handleEditSave = () => {
    if (!snippetToEdit) {
      console.warn("Nothing edited");
      return;
    }
    const passwordChange: string | null | undefined = !passwordDirty
      ? undefined
      : passwordEdit.trim() === ""
        ? null
        : passwordEdit;
    updateSnippet.mutate(
      {
        id: snippetToEdit.id,
        markdown: snippetToEdit?.markdown,
        expirationHours: snippetToEdit?.expirationHours,
        password: passwordChange,
      },
      {
        onSuccess: () => {
          closeEdit();
        },
      },
    );
  };

  const handleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleShareLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(
        import.meta.env.VITE_FRONTEND_URL + "/share/" + snippet.shareCode,
      )
      .then(() => {
        showDropToast("Copied Link", "copylink", 2000);
      })
      .catch(() => {
        showDropToast("Could not be copied", "nocopylink", 2000);
      });
  };

  const handleSnippetClick = () => {
    navigate("/share/" + snippet.shareCode);
  };

  return (
    <>
      <Modal
        isOpen={snippetToEdit ? true : false}
        title="Edit Snippet"
        onClose={closeEdit}
      >
        {snippetToEdit ? (
          <div className={styles.editForm}>
            <div className={styles.editField}>
              <label className={styles.editFieldLabel} htmlFor="edit-markdown">
                Markdown
              </label>
              <textarea
                id="edit-markdown"
                className={styles.editTextArea}
                value={snippetToEdit.markdown}
                onChange={(e) => {
                  setSnippetToEdit({
                    ...snippetToEdit,
                    markdown: e.target.value,
                  });
                }}
              />
            </div>

            <div className={styles.editField}>
              <label className={styles.editFieldLabel} htmlFor="edit-password">
                Password{" "}
                <span className={styles.editFieldHint}>
                  {snippet.hasPassword
                    ? "(leave unchanged or empty to remove)"
                    : "(optional)"}
                </span>
              </label>
              <input
                id="edit-password"
                type="text"
                name="snippet-passcode"
                className={`${styles.editInput} ${styles.maskedInput}`}
                value={passwordEdit}
                placeholder={
                  snippet.hasPassword
                    ? "Set new password…"
                    : "Leave empty for public"
                }
                onChange={(e) => {
                  setPasswordEdit(e.target.value);
                  setPasswordDirty(true);
                }}
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                data-form-type="other"
              />
              {snippet.hasPassword && passwordDirty && passwordEdit === "" && (
                <p className={styles.editHintWarn}>
                  Password will be removed on save.
                </p>
              )}
            </div>

            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.editCancelButton}
                onClick={closeEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.editSaveButton}
                onClick={handleEditSave}
                disabled={updateSnippet.isPending}
              >
                {updateSnippet.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
      <div className={styles.snippetContainer} key={snippet.shareCode}>
        <div className={styles.snippet} onClick={handleSnippetClick}>
          <p className={styles.snippetContent}>
            {snippet.markdown.slice(0, 100)}...
          </p>
          <div className={styles.metadata}>
            <p
              onClick={handleShareLinkClick}
              className={`${styles.text} ${styles.shareLink}`}
            >
              {snippet.hasPassword && (
                <Lock
                  className={styles.lockIcon}
                  width={11}
                  height={11}
                  aria-label="Password protected"
                />
              )}
              share/{snippet.shareCode}
            </p>
            <SnippetExpiration snippet={snippet} />
          </div>
        </div>
        <div className={styles.edit} ref={containerRef}>
          <button className={styles.button} onClick={handleDropdown}>
            <EllipsisVertical width={18} height={18} />
          </button>
          <Dropdown
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            items={[
              {
                label: "View",
                onClick: () => handleView(snippet),
              },
              {
                label: "Copy",
                onClick: () => handleCopy(snippet),
              },
              {
                label: "Edit",
                onClick: () => handleEdit(snippet),
              },
              {
                label: "Delete",
                onClick: () => handleDelete(snippet),
                type: "destroy",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
