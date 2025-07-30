import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface GuestUser {
  id: string;
  sessionId: string;
  cartData: Record<string, unknown>;
}

interface AppState {
  user: User | null;
  guestUser: GuestUser | null;
  isGuest: boolean;
  cartItemCount: number;
  setUser: (user: User) => void;
  clearUser: () => void;
  setGuestUser: (guestUser: GuestUser) => void;
  clearGuestUser: () => void;
  updateCartCount: (count: number) => void;
  updateGuestCart: (cartData: Record<string, unknown>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      guestUser: null,
      isGuest: false,
      cartItemCount: 0,
      setUser: (user) => set({ 
        user, 
        isGuest: false,
        guestUser: null 
      }),
      clearUser: () => set({ 
        user: null, 
        isGuest: false 
      }),
      setGuestUser: (guestUser) => set({ 
        guestUser, 
        isGuest: true,
        user: null,
        cartItemCount: Object.keys(guestUser.cartData || {}).length
      }),
      clearGuestUser: () => set({ 
        guestUser: null, 
        isGuest: false,
        cartItemCount: 0
      }),
      updateCartCount: (count) => set({ cartItemCount: count }),
      updateGuestCart: (cartData) => {
        const { guestUser } = get();
        if (guestUser) {
          set({
            guestUser: { ...guestUser, cartData },
            cartItemCount: Object.keys(cartData || {}).length
          });
        }
      },
    }),
    {
      name: 'nike-app-storage',
      partialize: (state) => ({
        user: state.user,
        guestUser: state.guestUser,
        isGuest: state.isGuest,
        cartItemCount: state.cartItemCount,
      }),
    }
  )
);
