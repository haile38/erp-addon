import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { logout as logoutApi } from "../api/auth.api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserInfo {
  name: string;
  email: string;
  userName?: string;
  id?: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  saveAuth: (token: string, refreshToken: string, userInfo?: UserInfo) => void;
  logout: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStoredUserInfo = (): UserInfo | null => {
  const stored = localStorage.getItem("userInfo");
  return stored ? JSON.parse(stored) : null;
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(getStoredUserInfo);

  const saveAuth = (token: string, refreshToken: string, userInfo?: UserInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(token);

    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo);
    }
  };

  const logout = async () => {
    await logoutApi();
    clearAuthStorage();
    setToken(null);
    setUserInfo(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{
      token,
      userInfo,
      loading: false,
      isAuthenticated: !!token,
      saveAuth,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};