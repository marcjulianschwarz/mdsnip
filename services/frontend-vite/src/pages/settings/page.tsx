import { usePreferences } from "@/hooks/usePreferences";
import styles from "./page.module.css";
import { type ChangeEvent, useState } from "react";
import { type Preferences } from "@/services/preferences.service";
import { type UseMutationResult } from "@tanstack/react-query";
import { useDropToast } from "@/hooks/useDropToast";

function AuthenticatedSettingsPage({
  preferences,
  updatePreference,
}: {
  preferences: Preferences;
  updatePreference: UseMutationResult<
    Preferences | null,
    Error,
    {
      key: keyof Preferences;
      value: string | number | null;
    },
    unknown
  >;
}) {
  const [defaultShareAction, setDefaultShareAction] = useState<string>(
    preferences?.defaultShareAction,
  );
  const [defaultExpirationTime, setDefaultExpirationTime] = useState<
    number | null
  >(preferences?.defaultExpirationTime);

  const { showDropToast } = useDropToast();
  const handleSave = async () => {
    try {
      await Promise.all([
        updatePreference.mutateAsync({
          key: "defaultShareAction",
          value: defaultShareAction,
        }),
        updatePreference.mutateAsync({
          key: "defaultExpirationTime",
          value: defaultExpirationTime,
        }),
      ]);

      showDropToast("Settings saved", "savesett", 2000, "success");
    } catch {
      showDropToast("Failed to save settings", "errorsett", 2000, "warning");
    }
  };

  const handleShareActionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDefaultShareAction(e.target.value);
  };

  const handleExpirationTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDefaultExpirationTime(v ? parseInt(v) : null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.settings}>
        <div className={styles.setting}>
          <div className={styles.settingLabel}>
            <p className={styles.settingTitle}>Default share action</p>
            <p className={styles.settingDescription}>
              Performed when you press the Share button.
            </p>
          </div>
          <select
            className={styles.dropdown}
            value={defaultShareAction}
            onChange={handleShareActionChange}
          >
            <option value="view">Open shared view</option>
            <option value="snippets">Stay on snippets</option>
          </select>
        </div>

        <div className={styles.setting}>
          <div className={styles.settingLabel}>
            <p className={styles.settingTitle}>Default expiration time</p>
            <p className={styles.settingDescription}>
              Prefilled hours value for new snippets. Leave empty for no
              expiration.
            </p>
          </div>
          <input
            className={styles.input}
            placeholder="24"
            inputMode="numeric"
            value={defaultExpirationTime ?? ""}
            onChange={handleExpirationTimeChange}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { preferences, status, updatePreference } = usePreferences();

  switch (status) {
    case "pending":
      return (
        <div className={styles.page}>
          <p className={styles.empty}>Loading…</p>
        </div>
      );
    case "error":
      return (
        <div className={styles.page}>
          <p className={styles.empty}>Failed to load preferences.</p>
        </div>
      );
    case "success":
      if (!preferences) {
        return (
          <div className={styles.page}>
            <p className={styles.empty}>Please log in to change settings.</p>
          </div>
        );
      }
      return (
        <AuthenticatedSettingsPage
          preferences={preferences}
          updatePreference={updatePreference}
        />
      );
  }
}
