"use client";
import { usePreferences } from "@/app/hooks/usePreferences";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";
import { Preferences } from "@/app/services/preferences.service";
import { UseMutationResult } from "@tanstack/react-query";
import {
  DropToastStyle,
  useDropToast,
} from "@/app/components/DropToast/DropToast";

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
    preferences?.defaultShareAction
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

      showDropToast(
        "Settings saved successfully",
        "savesett",
        2000,
        DropToastStyle.Success
      );
    } catch {
      showDropToast(
        "Failed to save settings",
        "errorsett",
        2000,
        DropToastStyle.Warning
      );
    }
  };

  const handleShareActionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDefaultShareAction(e.target.value);
  };

  const handleExpirationTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefaultExpirationTime(parseInt(e.target.value));
  };

  return (
    <div className="mdsnip-container">
      <h1>Settings</h1>
      <div className={styles.settings}>
        <div className={styles.setting}>
          <div className={styles.settingLabel}>
            <p className={styles.settingTitle}>Default Share Action</p>
            <p className={styles.settingDescription}>
              This aciton is performed when you press the Share button.
            </p>
          </div>
          <select
            className={`${styles.dropdown} ${styles.settingValue}`}
            value={defaultShareAction}
            onChange={(e) => handleShareActionChange(e)}
          >
            <option value={"view"}>View</option>
            <option value={"snippets"}>Snippets</option>
          </select>
        </div>

        <div className={styles.setting}>
          <div className={styles.settingLabel}>
            <p className={styles.settingTitle}>Default Expiration Time</p>
            <p className={styles.settingDescription}>
              This will prefill the expiration time with the set amount of
              hours. Keep empty for indefinite expiration.
            </p>
          </div>
          <input
            className={`mdsnip-input ${styles.settingValue}`}
            placeholder="24"
            value={defaultExpirationTime || ""}
            onChange={handleExpirationTimeChange}
          ></input>
        </div>
      </div>
      <br />
      <button onClick={handleSave} className="mdsnip-button">
        Save
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { preferences, status, updatePreference } = usePreferences();

  switch (status) {
    case "pending":
      return <p>Preferences Pending</p>;
    case "error":
      return <p>Failed to load preferences</p>;
    case "success":
      if (!preferences) {
        return (
          <div className="mdsnip-container">
            <h1>Settings</h1>
            <p>Please login to change settings.</p>
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
