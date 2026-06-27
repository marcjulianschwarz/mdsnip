import markdownToHTML from "@/services/markdown";
import "@/styles/markdown.css";
import { useEffect, useState } from "react";

export default function MarkdownComponent({
  markdown,
  htmlGenerated,
}: {
  markdown: string;
  htmlGenerated?: (html: string) => void;
}) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    markdownToHTML(markdown).then((next) => {
      if (cancelled) return;
      setHtml(next);
      htmlGenerated?.(next);
    });
    return () => {
      cancelled = true;
    };
  }, [markdown, htmlGenerated]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
