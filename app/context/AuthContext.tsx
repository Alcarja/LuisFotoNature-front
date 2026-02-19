"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginCredentials } from "@/types/auth";
import type { User } from "@/types/user";
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
} from "@/app/adapters/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check token and fetch user
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Instead of checking localStorage, just ask the server "Who am I?"
        // The browser will automatically attach the httpOnly cookie
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user: userData } = await loginApi(credentials);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors (e.g. empty response body) — clear state regardless
    }
    setUser(null);
    queryClient.clear();
  };

  const refreshUser = async () => {
    try {
      // The browser automatically attaches the httpOnly cookie to this request
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // IMPORTANT: You cannot manually "removeItem" an httpOnly cookie.
      // Instead, just clear your local React state.
      setUser(null);

      // Optional: If your server hasn't already cleared the cookie via a 401 response,
      // you might want to call your logout API here to be safe.
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
