import { Audio, AVPlaybackStatus } from 'expo-av';

const AUDIO_BASE_URL = process.env.EXPO_PUBLIC_AUDIO_BASE_URL || 'https://dua.fyi';

// Registry of bundled local audio files
const LOCAL_AUDIO_MAP: Record<string, any> = {
  '/audio/1-1.mp3': require('../../assets/audio/1-1.mp3'),
  '/audio/1-2.mp3': require('../../assets/audio/1-2.mp3'),
  '/audio/1-3.mp3': require('../../assets/audio/1-3.mp3'),
  '/audio/1-4.mp3': require('../../assets/audio/1-4.mp3'),
};

class AudioService {
  private sound: Audio.Sound | null = null;
  private isConfigured = false;

  // Configure audio session for background playback
  async configure() {
    if (this.isConfigured) return;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    this.isConfigured = true;
  }

  // Load and play an audio file
  async play(uri: string, onStatusUpdate?: (status: AVPlaybackStatus) => void): Promise<void> {
    await this.configure();
    await this.stop(); // Stop any currently playing audio

    let source: any;

    if (LOCAL_AUDIO_MAP[uri]) {
      source = LOCAL_AUDIO_MAP[uri];
    } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
      source = { uri };
    } else if (uri.startsWith('/')) {
      source = { uri: `${AUDIO_BASE_URL}${uri}` };
    } else {
      source = { uri: `${AUDIO_BASE_URL}/${uri}` };
    }

    const { sound } = await Audio.Sound.createAsync(
      source,
      { shouldPlay: true },
      onStatusUpdate
    );
    this.sound = sound;
  }

  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  async seekTo(positionMillis: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(positionMillis);
    }
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    if (this.sound) {
      return await this.sound.getStatusAsync();
    }
    return null;
  }
}

export const audioService = new AudioService();
