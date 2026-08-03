import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { searchDuas, getChapterById, Dua } from '@/src/data';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, borderRadius, fontSize, fonts } from '@/src/theme';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Dua[]>([]);
  
  const themeColors = useThemeColors();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      setResults(searchDuas(debouncedQuery));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const renderResult = useCallback(({ item }: { item: Dua }) => {
    const chapter = getChapterById(item.chapterId);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.resultItem,
          { borderBottomColor: themeColors.border },
          pressed && { backgroundColor: themeColors.surfaceElevated }
        ]}
        onPress={() => {
          setQuery('');
          setResults([]);
          router.push(`/chapter/${item.chapterId}`);
        }}
      >
        <Text style={[styles.resultTitle, { color: themeColors.text }]} numberOfLines={1}>
          {chapter?.titleEn || 'Chapter'}
        </Text>
        <Text style={[styles.resultSnippet, { color: themeColors.textSecondary }]} numberOfLines={1}>
          {item.translation}
        </Text>
      </Pressable>
    );
  }, [themeColors, router]);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { 
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
      }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder="Search duas..."
          placeholderTextColor={themeColors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {Platform.OS === 'android' && query.length > 0 && (
          <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={{ color: themeColors.textMuted }}>✕</Text>
          </Pressable>
        )}
      </View>
      
      {results.length > 0 && (
        <View style={[styles.resultsContainer, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          shadowColor: themeColors.text,
        }]}>
          <FlatList
            data={results.slice(0, 10)}
            keyExtractor={(item) => item.id}
            renderItem={renderResult}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 250 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: Platform.OS === 'ios' ? borderRadius.md : borderRadius.sm,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
    fontSize: fontSize.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
  },
  clearBtn: {
    padding: spacing.sm,
  },
  resultsContainer: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  resultTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  resultSnippet: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
  },
});
