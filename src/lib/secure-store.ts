import * as SecureStore from 'expo-secure-store';

const KEYS = {
  SUPABASE_ACCESS_TOKEN: 'supabase_access_token',
  SUPABASE_REFRESH_TOKEN: 'supabase_refresh_token',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_ACTIVE_TIMESTAMP: 'last_active_timestamp',
} as const;

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  // Auth token helpers
  async setAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SUPABASE_ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(KEYS.SUPABASE_REFRESH_TOKEN, refreshToken);
  },

  async getAuthTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const accessToken = await SecureStore.getItemAsync(KEYS.SUPABASE_ACCESS_TOKEN);
    const refreshToken = await SecureStore.getItemAsync(KEYS.SUPABASE_REFRESH_TOKEN);
    return { accessToken, refreshToken };
  },

  async clearAuthTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.SUPABASE_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.SUPABASE_REFRESH_TOKEN);
  },

  // Biometric helpers
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  },

  // Activity tracking for grace period
  async setLastActiveTimestamp(): Promise<void> {
    await SecureStore.setItemAsync(KEYS.LAST_ACTIVE_TIMESTAMP, Date.now().toString());
  },

  async getLastActiveTimestamp(): Promise<number> {
    const value = await SecureStore.getItemAsync(KEYS.LAST_ACTIVE_TIMESTAMP);
    return value ? parseInt(value, 10) : 0;
  },

  KEYS,
};
