import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Snippet, SnippetService } from "../services/snippets.service";

interface DeleteSnippetOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  optimistic?: boolean;
}

export function useDeleteSnippet(options: DeleteSnippetOptions = {}) {
  const queryClient = useQueryClient();
  const { onError, onSuccess, optimistic = true } = options;

  return useMutation({
    mutationFn: (snippetId: string) => SnippetService.delete(snippetId),

    onMutate: async (snippetId) => {
      if (!optimistic) return;

      await queryClient.cancelQueries({ queryKey: ["snippets"] });
      const previousSnippets = queryClient.getQueryData(["snippets"]);

      queryClient.setQueryData(["snippets"], (old: Snippet[]) =>
        old?.filter((snippet) => snippet.id.toString() !== snippetId)
      );

      return { previousSnippets };
    },

    onError: (error: Error, snippetId, context) => {
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
