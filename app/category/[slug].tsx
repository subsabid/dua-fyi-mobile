import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { spacing } from '@/src/theme';
import { ChapterListItem } from '@/src/components/ChapterListItem';
import { categories, getCategoryById, getChaptersByCategory, getDuasByChapter } from '@/src/data';
import { Chapter } from '@/src/data/types';

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = useThemeColors();

  const category = slug ? getCategoryById(slug) : undefined;
  const chapters = slug ? getChaptersByCategory(slug) : [];

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: category.nameEn }} />
      
      <FlashList
        data={chapters}
        keyExtractor={(item: Chapter) => item.id.toString()}
        {...({ estimatedItemSize: 80 } as any)}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }: { item: Chapter }) => {
          const duas = getDuasByChapter(item.id);
          return (
            <ChapterListItem 
              chapter={item} 
              duaCount={duas.length}
            />
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
});
