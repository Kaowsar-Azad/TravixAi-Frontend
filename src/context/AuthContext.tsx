"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for mock session on mount
    const session = localStorage.getItem("travix_demo_session");
    if (session) {
      // eslint-disable-next-line
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const demoUser = {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    };
    setUser(demoUser);
    localStorage.setItem("travix_demo_session", JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("travix_demo_session");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
