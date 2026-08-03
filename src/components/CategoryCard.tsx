import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';

interface CategoryCardProps {
  category: Category;
  chapterCount: number;
  variant?: 'default' | 'compact';
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(({
  category,
  chapterCount,
  variant = 'default',
}) => {
  const themeColors = useThemeColors();
  const router = useRouter();

  const isCompact = variant === 'compact';

  return (
    <Pressable
      style={({ pressed }) => [
        isCompact ? styles.compactCard : styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
        pressed && { opacity: 0.8 }
      ]}
      onPress={() => router.push(`/category/${category.slug}`)}
    >
      <View style={[styles.iconContainer, isCompact && styles.compactIconContainer]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>

      <View style={isCompact ? styles.compactTextContainer : styles.textContainer}>
        <Text style={[isCompact ? styles.compactNameEn : styles.nameEn, { color: themeColors.text }]} numberOfLines={1}>
          {category.nameEn}
        </Text>
        
        {isCompact && (
          <Text style={[styles.compactNameAr, { color: themeColors.textSecondary }]} numberOfLines={1}>
            {category.nameAr}
          </Text>
        )}

        <Text style={[styles.count, { color: themeColors.textMuted }]}>
          {chapterCount} chapters
        </Text>
      </View>

      {!isCompact && (
        <Text style={[styles.nameAr, { color: themeColors.textSecondary }]} numberOfLines={1}>
          {category.nameAr}
        </Text>
      )}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  compactCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    width: 145,
    minHeight: 140,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  compactIconContainer: {
    marginRight: 0,
    marginBottom: spacing.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  icon: {
    fontSize: fontSize.xxl,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  compactTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  nameEn: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  compactNameEn: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xs + 1,
    textAlign: 'center',
    marginBottom: 2,
  },
  compactNameAr: {
    fontFamily: 'Amiri',
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: 2,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  nameAr: {
    fontFamily: 'Amiri',
    fontSize: fontSize.xl,
    marginLeft: spacing.sm,
  },
});
