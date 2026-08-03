import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  SUPABASE_ACCESS_TOKEN: 'supabase_access_token',
  SUPABASE_REFRESH_TOKEN: 'supabase_refresh_token',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_ACTIVE_TIMESTAMP: 'last_active_timestamp',
} as const;

const memoryStore: Record<string, string> = {};

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        } else {
          memoryStore[key] = value;
        }
      } catch {
        memoryStore[key] = value;
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return memoryStore[key] || null;
      } catch {
        return memoryStore[key] || null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },

  async delete(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        delete memoryStore[key];
      } catch {
        delete memoryStore[key];
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },

  // Auth token helpers
  async setAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.set(KEYS.SUPABASE_ACCESS_TOKEN, accessToken);
    await this.set(KEYS.SUPABASE_REFRESH_TOKEN, refreshToken);
  },

  async getAuthTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const accessToken = await this.get(KEYS.SUPABASE_ACCESS_TOKEN);
    const refreshToken = await this.get(KEYS.SUPABASE_REFRESH_TOKEN);
    return { accessToken, refreshToken };
  },

  async clearAuthTokens(): Promise<void> {
    await this.delete(KEYS.SUPABASE_ACCESS_TOKEN);
    await this.delete(KEYS.SUPABASE_REFRESH_TOKEN);
  },

  // Biometric helpers
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.set(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await this.get(KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  },

  // Activity tracking for grace period
  async setLastActiveTimestamp(): Promise<void> {
    await this.set(KEYS.LAST_ACTIVE_TIMESTAMP, Date.now().toString());
  },

  async getLastActiveTimestamp(): Promise<number> {
    const value = await this.get(KEYS.LAST_ACTIVE_TIMESTAMP);
    return value ? parseInt(value, 10) : 0;
  },

  KEYS,
};
