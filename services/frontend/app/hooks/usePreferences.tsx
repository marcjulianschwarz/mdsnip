"use client";
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PreferencesService,
  Preferences,
} from "../services/preferences.service";
import { useUser } from "./useUser";
import { ReactQueryStatus } from "../utils";

interface UpdatePreferenceInput {
  key: keyof Preferences;
  value: string | number | null;
  onSuccess?: (preferences: Preferences) => void;
  onError?: (error: Error) => void;
}

export type PreferencesContextType = {
  preferences: Preferences | null;
  status: ReactQueryStatus;
  updatePreference: ReturnType<typeof useUpdatePreference>;
};

export const PreferencesContext = createContext<
  PreferencesContextType | undefined
>(undefined);

function useUpdatePreference() {
  const { auth } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
      onSuccess,
      onError,
    }: UpdatePreferenceInput): Promise<Preferences | null> => {
      try {
        if (!auth.user) {
          throw new Error("No user authenticated");
        }

        const updatedPreferences = await PreferencesService.update(
          auth.user.id,
          key,
          value
        );

        if (!updatedPreferences) {
          throw new Error("Preferences could not be updated");
        }

        queryClient.setQueryData(
          ["preferences", auth.user?.id],
          updatedPreferences
        );

        onSuccess?.(updatedPreferences);
        return updatedPreferences;
      } catch (error) {
        onError?.(error as Error);
        throw error;
      }
    },
  });
}

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

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
}
