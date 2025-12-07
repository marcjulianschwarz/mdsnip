import type { User } from "@/services/auth.service";
import React from "react";

type AuthenticatedUser = {
  isAuthenticated: true;
  user: User;
  loading: false;
};

type UnauthenticatedUser = {
  isAuthenticated: false;
  user: undefined;
  loading: false;
};

type LoadingUser = {
  isAuthenticated: false;
  user: undefined;
  loading: true;
};

export type AuthState = AuthenticatedUser | UnauthenticatedUser | LoadingUser;
export type LoginState = "success" | "wrong";

interface UserContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<LoginState>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<User | undefined>;
}

export const UserContext = React.createContext<UserContextType | null>(null);
