import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { logout as logoutApi } from "../api/auth.api";

interface UserInfo {
  name: string;
  email: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  token: string | null;
  loading: boolean;
  saveAuth: (token: string, refreshToken: string, userInfo?: UserInfo) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [loading] = useState(false);

  const saveAuth = (
    token: string,
    refreshToken: string,
    userInfo?: UserInfo
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo);
    }

    setToken(token);
  };

  const logout = async () => {
    // 1. Gọi API logout để invalidate token phía server
    await logoutApi();

    // 2. Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    // 3. Clear state
    setToken(null);
    setUserInfo(null);

    // 4. Redirect
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    token,
    userInfo,
    loading,
    saveAuth,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};