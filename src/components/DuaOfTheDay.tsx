import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DuaCard } from './DuaCard';
import { getDuasByChapter, chapters } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';

export const DuaOfTheDay: React.FC = () => {
  const themeColors = useThemeColors();

  const { dua, chapterTitle } = useMemo(() => {
    // Generate a deterministic random index based on current date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Total chapters is usually 132 in Hisn al-Muslim
    const chapterCount = chapters.length;
    if (chapterCount === 0) return { dua: null, chapterTitle: '' };
    
    // Pick a chapter
    const chapterIndex = seed % chapterCount;
    const chapter = chapters[chapterIndex];
    
    // Pick a dua from that chapter
    const chapterDuas = getDuasByChapter(chapter.id);
    if (chapterDuas.length === 0) return { dua: null, chapterTitle: chapter.titleEn };
    
    const duaIndex = seed % chapterDuas.length;
    
    return {
      dua: chapterDuas[duaIndex],
      chapterTitle: chapter.titleEn
    };
  }, []);

  if (!dua) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: themeColors.accent }]}>Dua of the Day</Text>
        <Text style={[styles.chapterTitle, { color: themeColors.textSecondary }]}>
          {chapterTitle}
        </Text>
      </View>
      <View style={[styles.cardWrapper, { borderColor: themeColors.accent }]}>
        <DuaCard dua={dua} index={1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  headerContainer: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  chapterTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
  },
  cardWrapper: {
    borderWidth: 2,
    borderRadius: borderRadius.lg + 2, // slightly larger to wrap the inner card well
    padding: 2, // inner spacing to show the border
  },
});
