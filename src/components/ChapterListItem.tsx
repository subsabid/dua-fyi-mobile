import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Chapter } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';

interface ChapterListItemProps {
  chapter: Chapter;
  duaCount: number;
}

export const ChapterListItem: React.FC<ChapterListItemProps> = React.memo(({ chapter, duaCount }) => {
  const themeColors = useThemeColors();
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomColor: themeColors.border,
          backgroundColor: pressed ? themeColors.surfaceElevated : 'transparent'
        }
      ]}
      onPress={() => router.push(`/chapter/${chapter.id}`)}
    >
      <View style={[styles.numberCircle, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={[styles.numberText, { color: themeColors.primary }]}>{chapter.id}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.titleEn, { color: themeColors.text }]} numberOfLines={2}>
          {chapter.titleEn}
        </Text>
        <Text style={[styles.duaCount, { color: themeColors.textMuted }]}>
          {duaCount} duas
        </Text>
      </View>

      <Text style={[styles.titleAr, { color: themeColors.textSecondary }]} numberOfLines={1}>
        {chapter.titleAr}
      </Text>

      <Text style={[styles.chevron, { color: themeColors.textMuted }]}>›</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: spacing.md,
  },
  titleEn: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    marginBottom: 4,
  },
  duaCount: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
  },
  titleAr: {
    fontFamily: 'Amiri',
    fontSize: fontSize.xl,
    maxWidth: '30%',
    textAlign: 'right',
  },
  chevron: {
    fontSize: fontSize.xl,
    fontFamily: fonts.regular,
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
});
