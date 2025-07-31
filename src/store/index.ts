import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  isGuest?: boolean;
}

interface GuestSession {
  sessionToken: string;
  cartData: unknown[];
  expiresAt: Date;
}

interface AppState {
  user: User | null;
  guestSession: GuestSession | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setGuestSession: (session: GuestSession) => void;
  clearGuestSession: () => void;
  updateCartData: (cartData: unknown[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  guestSession: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: true,
    guestSession: user.isGuest ? get().guestSession : null 
  }),
  
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  setGuestSession: (session) => set({ 
    guestSession: session 
  }),
  
  clearGuestSession: () => set({ 
    guestSession: null 
  }),
  
  updateCartData: (cartData) => set((state) => ({
    guestSession: state.guestSession 
      ? { ...state.guestSession, cartData }
      : null
  })),
}));

export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useGuestSession = () => useAppStore((state) => state.guestSession);
