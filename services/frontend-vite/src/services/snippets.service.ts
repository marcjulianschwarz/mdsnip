import { HttpService } from "./http.service";

export interface Snippet {
  id: string;
  markdown: string;
  userId?: string;
  createdAt: Date;
  expiresAt?: Date;
  expirationHours?: number;
  shareCode: string;
  hasPassword?: boolean;
}

type ByShareCodeRespone =
  | { expired: true }
  | { protected: true }
  | { expired: false; snippet: Snippet }
  | { notFound: true };

export class SnippetService {
  static async create(
    markdown: string,
    userId?: string,
    expirationHours?: number,
    password?: string,
  ) {
    const res = await HttpService.post("/snippets", {
      markdown,
      userId,
      expirationHours,
      password: password || undefined,
    });
    if (res.ok) {
      const data = await res.json();
      return data as Snippet;
    }
  }

  static async unlock(
    shareCode: string,
    password: string,
  ): Promise<Snippet | "invalid" | undefined> {
    const res = await HttpService.post(
      `/snippets/by-share-code/${shareCode}/unlock`,
      { password },
    );
    if (res.status === 401) return "invalid";
    if (res.ok) {
      const data = (await res.json()) as { snippet: Snippet };
      return data.snippet;
    }
  }

  static async getByShareCode(
    shareCode: string,
  ): Promise<ByShareCodeRespone | undefined> {
    const res = await HttpService.get(`/snippets/by-share-code/${shareCode}`);
    if (res.status === 404) return { notFound: true };
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
    update: {
      markdown?: string;
      expirationHours?: number | null;
      password?: string | null;
    },
  ) {
    const res = await HttpService.patch(`/snippets/${snippetId}`, update);
    if (res.ok) {
      const data = await res.json();
      return data as Snippet;
    }
  }
}
