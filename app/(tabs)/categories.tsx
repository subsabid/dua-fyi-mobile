import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { spacing } from '@/src/theme';
import { CategoryCard } from '@/src/components/CategoryCard';
import { categories, getChaptersByCategory } from '@/src/data';
import { Category } from '@/src/data/types';

export default function CategoriesScreen() {
  const theme = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Categories' }} />
      
      <FlashList
        data={categories}
        keyExtractor={(item: Category) => item.id.toString()}
        numColumns={2}
        {...({ estimatedItemSize: 140 } as any)}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }: { item: Category }) => {
          const chapters = getChaptersByCategory(item.slug);
          return (
            <View style={styles.cardContainer}>
              <CategoryCard 
                category={item} 
                chapterCount={chapters.length}
                variant="compact"
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.md,
  },
  cardContainer: {
    flex: 1,
    padding: spacing.xs,
  }
});
