import React from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Dua } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';
import { FavoriteButton } from './FavoriteButton';
import { useAudio } from '@/src/hooks/useAudio';
import { useFavoritesStore } from '@/src/stores/favoritesStore';

interface DuaCardProps {
  dua: Dua;
  index: number;
}

export const DuaCard: React.FC<DuaCardProps> = React.memo(({
  dua,
  index,
}) => {
  const themeColors = useThemeColors();
  const { play, isPlaying, currentDuaId } = useAudio();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(dua.id);
  const isThisAudioActive = currentDuaId === dua.id;
  const isThisAudioPlaying = isThisAudioActive && isPlaying;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`${dua.arabic}\n\n${dua.translation}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${dua.arabic}\n\n${dua.translation}\n\n- ${dua.reference}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.card, { 
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border 
    }]}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: themeColors.primary }]}>
          <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{index}</Text>
        </View>
        {dua.repeatCount > 1 && (
          <View style={[styles.repeatBadge, { backgroundColor: themeColors.primaryLight }]}>
            <Text style={styles.repeatText}>Repeat {dua.repeatCount}x</Text>
          </View>
        )}
      </View>

      <Text style={[styles.arabic, { color: themeColors.text }]} selectable>
        {dua.arabic}
      </Text>

      {!!dua.transliteration && (
        <Text style={[styles.transliteration, { color: themeColors.textSecondary }]} selectable>
          {dua.transliteration}
        </Text>
      )}

      <Text style={[styles.translation, { color: themeColors.text }]} selectable>
        {dua.translation}
      </Text>

      <Text style={[styles.reference, { color: themeColors.textMuted }]}>
        {dua.reference}
      </Text>

      <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={[styles.actionText, { color: themeColors.primary }]}>Copy</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={[styles.actionText, { color: themeColors.primary }]}>Share</Text>
          </Pressable>
          {dua.audioUrl && (
            <Pressable
              onPress={() => play(dua.id, dua.audioUrl!)}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            >
              <Text style={[styles.actionText, { color: isThisAudioPlaying ? themeColors.primaryDark : themeColors.primary }]}>
                {isThisAudioPlaying ? '🔊 Playing' : '🔊 Play'}
              </Text>
            </Pressable>
          )}
        </View>
        
        <FavoriteButton
          isFavorite={favorited}
          onToggle={() => toggleFavorite(dua.id, dua.chapterId)}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.bold,
  },
  repeatBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  repeatText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  arabic: {
    fontFamily: 'Amiri',
    fontSize: fontSize.arabic,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 45,
    marginBottom: spacing.lg,
  },
  transliteration: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  translation: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  reference: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
