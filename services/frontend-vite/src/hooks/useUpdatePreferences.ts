import {
  type Preferences,
  PreferencesService,
} from "@/services/preferences.service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser } from "./useUser";

interface UpdatePreferenceInput {
  key: keyof Preferences;
  value: string | number | null;
  onSuccess?: (preferences: Preferences) => void;
  onError?: (error: Error) => void;
}

export function useUpdatePreference() {
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
          value,
        );

        if (!updatedPreferences) {
          throw new Error("Preferences could not be updated");
        }

        queryClient.setQueryData(
          ["preferences", auth.user?.id],
          updatedPreferences,
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
