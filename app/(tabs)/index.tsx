import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { spacing, fontSize, fonts, borderRadius } from '@/src/theme';
import { SearchBar } from '@/src/components/SearchBar';
import { DuaOfTheDay } from '@/src/components/DuaOfTheDay';
import { CategoryCard } from '@/src/components/CategoryCard';
import { categories, getChaptersByCategory } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';

const HERO_HEIGHT = Math.max(420, Dimensions.get('window').height * 0.52);

export default function HomeScreen() {
  const theme = useThemeColors();

  // Get top 4 categories
  const quickCategories = categories.slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ═══ Immersive Hero Section ═══ */}
      <ImageBackground
        source={require('../../assets/images/hero-banner.jpg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(15, 20, 25, 0.55)',
            'rgba(15, 20, 25, 0.78)',
            'rgba(15, 20, 25, 0.95)',
          ]}
          locations={[0, 0.5, 1]}
          style={styles.heroOverlay}
        >
          {/* Brand name — centered at top with website typography */}
          <Text style={styles.brandName}>
            dua.fyi<Text style={{ color: theme.primary }}>.</Text>
          </Text>

          <Text style={styles.bismillah}>
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </Text>

          <Text style={styles.tagline}>
            Your daily companion for{'\n'}authentic Islamic supplications
          </Text>

          <Text style={styles.subtitle}>
            Based on Hisn al-Muslim (Fortress of the Muslim)
          </Text>

          {/* Search bar inside hero */}
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* ═══ Content below the hero ═══ */}
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {/* Dua of the Day */}
        <DuaOfTheDay />

        {/* Quick Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Categories
          </Text>
          <Text
            style={[styles.seeAll, { color: theme.primary }]}
            onPress={() => router.push('/(tabs)/categories')}
          >
            See All
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickCategoriesContainer}
        >
          {quickCategories.map((category) => {
            const chapters = getChaptersByCategory(category.slug);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                chapterCount={chapters.length}
                variant="compact"
              />
            );
          })}
        </ScrollView>

        {/* Stats Card */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="library" size={24} color={theme.primary} />
          <Text style={[styles.statsText, { color: theme.textSecondary }]}>
            132 Chapters • 267+ Duas • From the Quran & Sunnah
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

  /* ─── Hero Section ─── */
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  heroOverlay: {
    width: '100%',
    height: HERO_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 32) + 12,
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
  },
  brandName: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 32) + 12,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.arabic,
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  bismillah: {
    width: '100%',
    fontFamily: fonts.arabic,
    fontSize: 28,
    color: '#FBBF24',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  tagline: {
    width: '100%',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  subtitle: {
    width: '100%',
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  searchContainer: {
    width: '100%',
    maxWidth: 500,
  },

  /* ─── Content Area ─── */
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -borderRadius.xl,
    paddingTop: spacing.xl,
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
    paddingRight: spacing.md,
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
    fontSize: fontSize.sm,
    textAlign: 'center',
    flexShrink: 1,
  },
});
