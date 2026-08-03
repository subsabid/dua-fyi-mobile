import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, fontSize, fonts, borderRadius } from '@/src/theme';
import { SearchBar } from '@/src/components/SearchBar';
import { DuaOfTheDay } from '@/src/components/DuaOfTheDay';
import { CategoryCard } from '@/src/components/CategoryCard';
import { categories, getChaptersByCategory } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const theme = useThemeColors();

  // Get top 4 categories
  const quickCategories = categories.slice(0, 4);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'dua.fyi' }} />
      
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.bismillah, { color: theme.accent }]}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Text>
        <Text style={[styles.subtitle, { color: theme.surface }]}>
          Fortress of the Muslim
        </Text>
      </View>

      <View style={styles.content}>
        <SearchBar />

        <DuaOfTheDay />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Categories</Text>
          <Text 
            style={[styles.seeAll, { color: theme.primary }]}
            onPress={() => router.push('/(tabs)/categories')}
          >
            See All
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickCategoriesContainer}>
          {quickCategories.map((category) => {
            const chapters = getChaptersByCategory(category.slug);
            return (
              <View key={category.id} style={styles.categoryWrapper}>
                <CategoryCard 
                  category={category} 
                  chapterCount={chapters.length}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="library" size={24} color={theme.primary} />
          <Text style={[styles.statsText, { color: theme.textSecondary }]}>
            132 Chapters • 267+ Duas
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  bismillah: {
    fontFamily: fonts.arabic,
    fontSize: fontSize.xxxl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
  },
  seeAll: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
  },
  quickCategoriesContainer: {
    gap: spacing.md,
    paddingRight: spacing.md, // For safe area scrolling
  },
  categoryWrapper: {
    width: 140, // compact size
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  statsText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
  }
});
