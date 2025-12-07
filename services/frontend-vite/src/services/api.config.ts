export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
};
