export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
};
