import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export interface Snippet {
  id: number;
  markdown: string;
  shareCode: string;
  createdAt: Date;
  userId: number | null;
  expiresAt: string | null;
  expirationHours: number | null;
}

export async function createSnippet(markdown: string): Promise<Snippet> {
  const res = await fetch(`https://mdsnip.com/api/snippets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const snippet = (await res.json()) as Snippet;
  console.log(snippet);

  return snippet;
}
// Create server instance
const server = new McpServer({
  name: "mdsnip",
  version: "1.0.0",
});

server.tool(
  "get-markdown-share-url",
  "Get a shareable URL for markdown which shows it nicely formatted.",
  {
    state: z.string().describe("Markdown text that should be shared"),
  },
  async ({ state }) => {
    const markdown = state;

    if (!markdown) {
      return {
        content: [
          {
            type: "text",
            text: "You have to specify some markdown to be shared.",
          },
        ],
      };
    }

    const snippet = await createSnippet(markdown);
    const shareLink = `http://mdsnip.com/share/${snippet.shareCode}`;

    return {
      content: [{ type: "text", text: shareLink }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mdsnip MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
