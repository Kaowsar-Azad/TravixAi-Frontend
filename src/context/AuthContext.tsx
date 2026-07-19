"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "../lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const logout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: session?.user as User | null ?? null, 
        logout, 
        isLoading: isPending 
      }}
    >
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
