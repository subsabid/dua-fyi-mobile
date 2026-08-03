import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentDuaId: string | null;
  currentAudioUrl: string | null;
  durationMillis: number;
  positionMillis: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPlaying: (isPlaying: boolean) => void;
  setCurrentDua: (duaId: string, audioUrl: string) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentDuaId: null,
  currentAudioUrl: null,
  durationMillis: 0,
  positionMillis: 0,
  isLoading: false,
  error: null,

  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentDua: (duaId, audioUrl) => set({ currentDuaId: duaId, currentAudioUrl: audioUrl, positionMillis: 0, durationMillis: 0, error: null }),
  setPosition: (positionMillis) => set({ positionMillis }),
  setDuration: (durationMillis) => set({ durationMillis }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isPlaying: false, isLoading: false }),
  reset: () => set({ isPlaying: false, currentDuaId: null, currentAudioUrl: null, durationMillis: 0, positionMillis: 0, isLoading: false, error: null }),
}));
