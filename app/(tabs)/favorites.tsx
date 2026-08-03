import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { EmptyState } from '@/src/components/EmptyState';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { DuaCard } from '@/src/components/DuaCard';
import { Dua } from '@/src/data/types';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '@/src/theme';

export default function FavoritesScreen() {
  const theme = useThemeColors();
  const { getFavoriteDuas, getFavoriteCount, isLoaded, favoriteIds } = useFavoritesStore();
  const [duas, setDuas] = useState<Dua[]>([]);

  useEffect(() => {
    if (isLoaded) {
      getFavoriteDuas().then(setDuas);
    }
  }, [isLoaded, favoriteIds, getFavoriteDuas]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Favorites',
          headerRight: () => (
            <View style={styles.headerBadge}>
              <Ionicons name="heart" size={18} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.text }]}>
                {getFavoriteCount()}
              </Text>
            </View>
          ),
        }} 
      />
      
      {!isLoaded ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : duas.length === 0 ? (
        <EmptyState 
          icon="heart-outline"
          title="No favorites yet"
          subtitle="Tap the heart on any dua to save it here"
        />
      ) : (
        <FlashList
          data={duas}
          keyExtractor={(item: Dua) => item.id}
          {...({ estimatedItemSize: 300 } as any)}
          renderItem={({ item, index }: { item: Dua; index: number }) => (
            <DuaCard dua={item} index={index + 1} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: spacing.md,
  },
});
