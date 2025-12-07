import { PreferencesContext } from "@/contexts/PreferencesContext";
import { useUpdatePreference } from "@/hooks/useUpdatePreferences";
import { useUser } from "@/hooks/useUser";
import {
  type Preferences,
  PreferencesService,
} from "@/services/preferences.service";
import { useQuery } from "@tanstack/react-query";

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useUser();

  const { data: preferences, status } = useQuery<Preferences | null>({
    queryKey: ["preferences", auth.user?.id],
    queryFn: async () => {
      if (!auth.user) return null;
      const pref = await PreferencesService.get(auth.user.id);
      if (!pref) throw new Error("Failed loading preferences");
      return pref;
    },
    retry: false,
    throwOnError: true,
  });

  const updatePreference = useUpdatePreference();

  const providerValue = {
    preferences: status === "success" ? preferences : null,
    status,
    updatePreference,
  };

  return (
    <PreferencesContext.Provider value={providerValue}>
      {children}
    </PreferencesContext.Provider>
  );
}
