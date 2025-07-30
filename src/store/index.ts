import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string | null;
  isGuest?: boolean | null;
  emailVerified?: boolean | null;
  image?: string | null;
}

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
