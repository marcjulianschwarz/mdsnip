import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Snippet, SnippetService } from "../services/snippets.service";

interface CreateSnippetOptions {
  onError?: (error: Error) => void;
  onSuccess?: (snippet: Snippet) => void;
}

interface CreateSnippetInput {
  markdown: string;
  userId?: string;
  expirationHours?: number;
}

export function useCreateSnippet(options: CreateSnippetOptions = {}) {
  const queryClient = useQueryClient();
  const { onError, onSuccess } = options;

  return useMutation({
    mutationFn: async (input: CreateSnippetInput): Promise<Snippet> => {
      const snippet = await SnippetService.create(
        input.markdown,
        input.userId,
        input.expirationHours
      );

      if (!snippet) {
        throw new Error("Snippet could not be created");
      }

      return snippet;
    },

    onError: (error: Error) => {
      onError?.(error);
    },

    onSuccess: (createdSnippet: Snippet) => {
      onSuccess?.(createdSnippet);
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
  });
}
