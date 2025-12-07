import { HttpService } from "./http.service";

export interface User {
  id: string;
  username: string;
}

export class AuthService {
  static async register(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const res = await HttpService.post("/auth/register", {
      username,
      password,
    });
    if (res.ok) {
      const data = await res.json();
      return data as User;
    } else if (res.status === 409) {
      // Conflict, user exists
      console.warn("User with this name already exists");
    }
  }

  static async login(username: string, password: string) {
    const res = await HttpService.post("/auth/login", { username, password });
    if (res.ok) {
      const data = await res.json();
      return data as User;
    }
  }

  static async logout() {
    const res = await HttpService.post("/auth/logout");
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }

  static async checkAuthClientSide() {
    try {
      const res = await HttpService.post("/auth/me");
      if (res.ok) {
        const data = await res.json();
        return data as User;
      }
      return undefined;
    } catch (error) {
      console.log("Authentication failed:", error);
      return undefined;
    }
  }
}
