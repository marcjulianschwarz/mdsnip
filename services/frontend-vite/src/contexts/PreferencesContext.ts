import type { useUpdatePreference } from "@/hooks/useUpdatePreferences";
import type { Preferences } from "@/services/preferences.service";
import type { ReactQueryStatus } from "@/utils";
import { createContext } from "react";

export type PreferencesContextType = {
  preferences: Preferences | null;
  status: ReactQueryStatus;
  updatePreference: ReturnType<typeof useUpdatePreference>;
};

export const PreferencesContext = createContext<
  PreferencesContextType | undefined
>(undefined);
