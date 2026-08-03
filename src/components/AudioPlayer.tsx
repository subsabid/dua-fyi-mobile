import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAudio } from '@/src/hooks/useAudio';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors } from '@/src/theme';

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function AudioPlayer() {
  const themeColors = useThemeColors();
  const {
    currentDuaId,
    isPlaying,
    isLoading,
    error,
    positionMillis,
    durationMillis,
    progress,
    togglePlayPause,
    stop
  } = useAudio();

  if (!currentDuaId) return null;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
            Playing Dua
          </Text>
          {error ? (
            <Text style={styles.errorText} numberOfLines={1}>{error}</Text>
          ) : (
            <Text style={[styles.timeText, { color: themeColors.textSecondary }]}>
              {formatTime(positionMillis)} / {formatTime(durationMillis)}
            </Text>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: themeColors.primary }]} 
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={themeColors.surface} />
            ) : (
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={stop}>
            <Text style={[styles.stopIcon, { color: themeColors.textSecondary }]}>✖</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.progressContainer, { backgroundColor: themeColors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: themeColors.primary,
              width: `${progress * 100}%` 
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Above tab bar, adjust as needed
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playIcon: {
    fontSize: 16,
    color: 'white',
  },
  stopButton: {
    padding: 8,
  },
  stopIcon: {
    fontSize: 14,
  },
  progressContainer: {
    height: 4,
    width: '100%',
  },
  progressBar: {
    height: '100%',
  },
});
