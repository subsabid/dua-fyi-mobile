import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { spacing } from '@/src/theme';
import { CategoryCard } from '@/src/components/CategoryCard';
import { categories, getChaptersByCategory } from '@/src/data';

export default function CategoriesScreen() {
  const theme = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Categories' }} />
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
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
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
  }
});
