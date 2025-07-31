"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { getCurrentUser } from '@/lib/auth/actions';

export function useAuth() {
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
      }
    };

    if (!user) {
      initAuth();
    }
  }, [user, setUser]);

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
}
