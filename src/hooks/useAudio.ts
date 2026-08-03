import { useCallback } from 'react';
import { AVPlaybackStatus } from 'expo-av';
import { audioService } from '@/src/lib/audio';
import { useAudioStore } from '@/src/stores/audioStore';

export function useAudio() {
  const store = useAudioStore();

  const handleStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      store.setPosition(status.positionMillis);
      store.setDuration(status.durationMillis || 0);
      store.setPlaying(status.isPlaying);
      store.setLoading(false);

      // Auto-stop when playback finishes
      if (status.didJustFinish) {
        store.reset();
      }
    } else if (status.error) {
      store.setError(status.error);
    }
  }, [store]);

  const play = useCallback(async (duaId: string, audioUrl: string) => {
    try {
      store.setLoading(true);
      store.setCurrentDua(duaId, audioUrl);
      await audioService.play(audioUrl, handleStatusUpdate);
    } catch (error: any) {
      store.setError(error.message || 'Failed to play audio');
    }
  }, [store, handleStatusUpdate]);

  const togglePlayPause = useCallback(async () => {
    try {
      if (store.isPlaying) {
        await audioService.pause();
      } else {
        await audioService.resume();
      }
    } catch (error: any) {
      store.setError(error.message || 'Playback error');
    }
  }, [store]);

  const stop = useCallback(async () => {
    try {
      await audioService.stop();
      store.reset();
    } catch (error: any) {
      store.setError(error.message);
    }
  }, [store]);

  return {
    isPlaying: store.isPlaying,
    currentDuaId: store.currentDuaId,
    durationMillis: store.durationMillis,
    positionMillis: store.positionMillis,
    isLoading: store.isLoading,
    error: store.error,
    progress: store.durationMillis > 0 ? store.positionMillis / store.durationMillis : 0,
    play,
    togglePlayPause,
    stop,
  };
}
