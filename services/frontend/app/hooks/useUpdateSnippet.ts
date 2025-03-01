import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Snippet, SnippetService } from "../services/snippets.service";

interface UpdateSnippetData {
  id: string;
  markdown?: string;
  expirationHours?: number;
}

interface UpdateSnippetOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  optimistic?: boolean;
}

export function useUpdateSnippet(options: UpdateSnippetOptions = {}) {
  const queryClient = useQueryClient();
  const { onError, onSuccess, optimistic = true } = options;

  return useMutation({
    mutationFn: (data: UpdateSnippetData) =>
      SnippetService.updateSnippet(data.id, data),

    onMutate: async (updateData) => {
      if (!optimistic) return;

      await queryClient.cancelQueries({ queryKey: ["snippets"] });
      const previousSnippets = queryClient.getQueryData(["snippets"]);

      queryClient.setQueryData(["snippets"], (old: Snippet[]) =>
        old?.map((snippet) =>
          snippet.id.toString() === updateData.id
            ? { ...snippet, ...updateData }
            : snippet
        )
      );

      return { previousSnippets };
    },

    onError: (error: Error, updateData, context) => {
      if (optimistic) {
        queryClient.setQueryData(["snippets"], context?.previousSnippets);
      }
      onError?.(error);
    },

    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
  });
}
