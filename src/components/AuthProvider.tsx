"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getCurrentUser } from '@/lib/auth/actions';

interface AuthContextType {
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    isGuest?: boolean;
  } | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, isAuthenticated } = useAppStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ isLoading, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
