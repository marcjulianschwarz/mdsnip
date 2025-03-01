import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export default async function markdownToHTML(markdown: string) {
  const html = await marked.parse(markdown, { async: true });
  return DOMPurify.sanitize(html);
}

export async function downloadMarkdown(markdown: string) {
  try {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "download.md";

    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the markdown file:", error);
  }
}

export async function downloadHtml(html: string) {
  try {
    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "download.html";

    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the markdown file:", error);
  }
}
