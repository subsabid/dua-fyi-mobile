import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type FontSizeOption = 'small' | 'medium' | 'large';

interface SettingsState {
  themeMode: ThemeMode;
  arabicFontSize: FontSizeOption;
  biometricLock: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  autoPlayNext: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setArabicFontSize: (size: FontSizeOption) => void;
  setBiometricLock: (enabled: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  setShowTranslation: (show: boolean) => void;
  setAutoPlayNext: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      arabicFontSize: 'medium',
      biometricLock: false,
      showTransliteration: true,
      showTranslation: true,
      autoPlayNext: false,

      setThemeMode: (themeMode) => set({ themeMode }),
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
      setBiometricLock: (biometricLock) => set({ biometricLock }),
      setShowTransliteration: (showTransliteration) => set({ showTransliteration }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setAutoPlayNext: (autoPlayNext) => set({ autoPlayNext }),
    }),
    {
      name: 'dua-fyi-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
