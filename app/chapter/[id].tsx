import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing } from '@/src/theme';
import { DuaCard } from '@/src/components/DuaCard';
import { getChapterById, getDuasByChapter } from '@/src/data';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapterId = id ? parseInt(id as string, 10) : -1;
  const theme = useThemeColors();

  const chapter = getChapterById(chapterId);
  const duas = getDuasByChapter(chapterId);

  if (!chapter) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Chapter not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: chapter.titleEn }} />
      
      <FlashList
        data={duas}
        keyExtractor={(item: any) => item.id.toString()}
        {...({ estimatedItemSize: 300 } as any)}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <DuaCard 
            dua={item as any} 
            index={index + 1}
            />
        )}
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
