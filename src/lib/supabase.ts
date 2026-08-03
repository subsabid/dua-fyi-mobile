import { createClient } from '@supabase/supabase-js';
import { secureStorage } from './secure-store';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ytpnmjgsmadqhyogddmt.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cG5tamdzbWFkcWh5b2dkZG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjUzMjUsImV4cCI6MjEwMDc0MTMyNX0.n7fQS43DIBiaRXN6Y1GW2hORlaeG_99Uk-xY4phJl3c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        return await secureStorage.get(key);
      },
      setItem: async (key: string, value: string) => {
        await secureStorage.set(key, value);
      },
      removeItem: async (key: string) => {
        await secureStorage.delete(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed in React Native
  },
});
