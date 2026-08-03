import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';

interface CategoryCardProps {
  category: Category;
  chapterCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, chapterCount }) => {
  const themeColors = useThemeColors();
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          shadowColor: themeColors.text,
        },
        pressed && { opacity: 0.8 }
      ]}
      onPress={() => router.push(`/category/${category.slug}`)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.nameEn, { color: themeColors.text }]} numberOfLines={1}>
          {category.nameEn}
        </Text>
        <Text style={[styles.count, { color: themeColors.textMuted }]}>
          {chapterCount} chapters
        </Text>
      </View>
      <Text style={[styles.nameAr, { color: themeColors.textSecondary }]} numberOfLines={1}>
        {category.nameAr}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Primary transparent
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fontSize.xxl,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameEn: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
  },
  nameAr: {
    fontFamily: 'Amiri',
    fontSize: fontSize.xl,
    marginLeft: spacing.sm,
  },
});
