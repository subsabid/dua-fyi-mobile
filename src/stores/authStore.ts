import { create } from 'zustand';
import { supabase } from '@/src/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false });
  },

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  }),
}));
