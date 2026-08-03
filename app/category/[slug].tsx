import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing } from '@/src/theme';
import { ChapterListItem } from '@/src/components/ChapterListItem';
import { categories, getChaptersByCategory, getDuasByChapter } from '@/src/data';

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = useThemeColors();

  const category = categories.find(c => c.slug === slug);
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
      
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
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
