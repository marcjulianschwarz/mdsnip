import { useQuery } from "@tanstack/react-query";
import { type Snippet, SnippetService } from "../../services/snippets.service";
import MarkdownComponent from "./MarkdownComponent";
import { downloadHtml, downloadMarkdown } from "@/services/markdown";
import { useState } from "react";

type MarkdownHTMLResponse =
  | { expired: true }
  | { snippet: Snippet; expired: false };

function HTMLContent({ slug }: { slug: string }) {
  const [html, setHtml] = useState<string>("");
  const { data, isPending, isError } = useQuery<MarkdownHTMLResponse>({
    throwOnError: true,
    queryKey: ["markdown", slug],
    queryFn: async () => {
      const response = await SnippetService.getByShareCode(slug);
      if (!response) throw new Error("Fetching failed");
      if (response.expired) return { expired: true };

      return { snippet: response.snippet, expired: false };
    },
    retry: false,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error Loading Snippet. Try again later.</p>;
  if (data.expired) return <p>Snippet expired</p>;

  return (
    <div>
      <h2>{new Date(data.snippet.createdAt).toLocaleDateString()}</h2>
      <button onClick={() => downloadMarkdown(data.snippet.markdown)}>
        Download Markdown
      </button>
      <button onClick={() => downloadHtml(html)}>Download HTML</button>
      <MarkdownComponent
        markdown={data.snippet.markdown}
        htmlGenerated={setHtml}
      />
    </div>
  );
}

export default HTMLContent;
