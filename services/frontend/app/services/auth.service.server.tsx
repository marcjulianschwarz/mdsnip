import { cookies } from "next/headers";
import { HttpService } from "./http.service";
import { User } from "./auth.service";

export class AuthServiceServer {
  static async checkAuthServerSide() {
    try {
      const cookieStore = await cookies();
      const res = await HttpService.post("/auth/me", undefined, {
        headers: {
          Cookie: cookieStore.toString(), // for server side requests I am getting the cookies from the browser here
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data as User;
      }
      return null;
    } catch (error) {
      console.log("Server User Authentication failed:", error);
      return null;
    }
  }
}
