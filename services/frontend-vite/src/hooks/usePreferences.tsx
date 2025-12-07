import { useContext } from "react";
import {
  PreferencesContext,
  type PreferencesContextType,
} from "@/contexts/PreferencesContext";

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
}
