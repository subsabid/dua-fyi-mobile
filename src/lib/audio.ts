import { Audio, AVPlaybackStatus } from 'expo-av';

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

    const { sound } = await Audio.Sound.createAsync(
      { uri },
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
