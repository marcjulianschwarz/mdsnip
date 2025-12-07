import { API_CONFIG } from "./api.config";

export class HttpService {
  private static async fetch(
    endpoint: string,
    options: RequestInit,
  ): Promise<Response> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(options.method, endpoint);

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...API_CONFIG.headers, ...options.headers },
        credentials: API_CONFIG.credentials,
      });

      return response;
    } catch (error) {
      throw new Error(`Request failed for ${endpoint}: ${error}`);
    }
  }

  static get(endpoint: string): Promise<Response> {
    const res = this.fetch(endpoint, { method: "GET" });
    return res;
  }

  static post(
    endpoint: string,
    data?: unknown,
    customOptions: Partial<RequestInit> = {},
  ): Promise<Response> {
    return this.fetch(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...customOptions,
    });
  }

  static delete(endpoint: string): Promise<Response> {
    return this.fetch(endpoint, { method: "DELETE" });
  }

  static patch(endpoint: string, data?: unknown): Promise<Response> {
    return this.fetch(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}
