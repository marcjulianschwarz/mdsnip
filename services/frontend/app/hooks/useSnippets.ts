import { useQuery } from "@tanstack/react-query";
import { SnippetService } from "../services/snippets.service";

export function useSnippets(userId: string) {
  return useQuery({
    queryKey: ["snippets", userId],
    queryFn: async () => {
      const snippets = await SnippetService.getByUserId(userId);
      if (!snippets) {
        return [];
      } else {
        return snippets;
      }
    },
  });
}
