import {
  UserContext,
  type AuthState,
  type LoginState,
} from "@/contexts/UserContext";
import { type User, AuthService } from "@/services/auth.service";
import { useState, useEffect } from "react";

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
  initialUser?: User;
}) {
  void children;
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: undefined,
    loading: true,
  });
  void auth;

  console.log("UserProvider running.");

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Chekcing Authentication");
      try {
        const userData = await AuthService.checkAuthClientSide();
        if (userData) {
          setAuth({
            isAuthenticated: true,
            user: userData,
            loading: false,
          });
        } else {
          setAuth({
            isAuthenticated: false,
            user: undefined,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuth({
          isAuthenticated: false,
          user: undefined,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<LoginState> => {
    console.log(`${username} is loggin in.`);
    setAuth({ isAuthenticated: false, user: undefined, loading: true });
    try {
      await AuthService.login(username, password);
    } catch {
      return "wrong";
    }
    const userData = await AuthService.checkAuthClientSide();

    if (userData) {
      console.log(`${username} logged in.`);
      setAuth({
        isAuthenticated: true,
        user: userData,
        loading: false,
      });
      return "success";
    } else {
      console.warn(`${username} login failed.`);
      setAuth({
        isAuthenticated: false,
        user: undefined,
        loading: false,
      });
      return "wrong";
    }
  };

  const logout = async () => {
    setAuth({
      isAuthenticated: false,
      user: undefined,
      loading: false,
    });
    await AuthService.logout();
    console.log(`${auth.user?.username} logged out.`);
  };

  const register = async (username: string, password: string) => {
    console.log(`${username} registering.`);
    const userData = await AuthService.register(username, password);
    if (userData) {
      console.log(`${username} registered.`);
      setAuth({
        isAuthenticated: true,
        user: userData,
        loading: false,
      });
      return userData;
    } else {
      console.log(`${username} failed to register.`);
      setAuth({
        isAuthenticated: false,
        user: undefined,
        loading: false,
      });
    }
  };

  return (
    <UserContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}
