import markdownToHTML from "@/app/services/markdown";
import "@/app/styles/markdown.css";
import { useState } from "react";

export default function MarkdownComponent({
  markdown,
  htmlGenerated,
}: {
  markdown: string;
  htmlGenerated?: (html: string) => void;
}) {
  const [html, setHtml] = useState<string>("");

  markdownToHTML(markdown).then((html) => {
    setHtml(html);
    htmlGenerated?.(html);
  });
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
