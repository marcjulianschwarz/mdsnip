import { HttpService } from "./http.service";

export interface Snippet {
  id: string;
  markdown: string;
  userId?: string;
  createdAt: Date;
  expiresAt?: Date;
  expirationHours?: number;
  shareCode: string;
}

type ByShareCodeRespone =
  | {
      expired: true;
    }
  | { expired: false; snippet: Snippet };

export class SnippetService {
  static async create(
    markdown: string,
    userId?: string,
    expirationHours?: number,
  ) {
    const res = await HttpService.post("/snippets", {
      markdown,
      userId,
      expirationHours,
    });
    if (res.ok) {
      const data = await res.json();
      return data as Snippet;
    }
  }

  static async getByShareCode(shareCode: string) {
    const res = await HttpService.get(`/snippets/by-share-code/${shareCode}`);
    if (res.ok) {
      const data = await res.json();
      return data as ByShareCodeRespone;
    }
  }

  static async getByUserId(userId: string) {
    const res = await HttpService.get(`/snippets/by-user-id/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data as Snippet[];
    }
  }

  static async delete(snippetId: string) {
    const res = await HttpService.delete(`/snippets/${snippetId}`);
    if (res.ok) {
      const data = await res.json();
      return data as Snippet[];
    }
  }

  static async updateSnippet(
    snippetId: string,
    update: { markdown?: string; expirationHours?: number | null },
  ) {
    const res = await HttpService.patch(`/snippets/${snippetId}`, update);
    if (res.ok) {
      const data = await res.json();
      return data as Snippet;
    }
  }
}
