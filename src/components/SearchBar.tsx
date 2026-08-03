import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getChapterById, Dua } from '@/src/data';
import { duas } from '@/src/data/duas';
import { smartSearchDuas, SearchResult } from '@/src/lib/searchEngine';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fonts } from '@/src/theme';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = useThemeColors();
  const router = useRouter();

  // Flatten all duas once for search
  const allDuas = useMemo(() => {
    const flat: Dua[] = [];
    for (const chapterId in duas) {
      flat.push(...duas[chapterId]);
    }
    return flat;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const res = smartSearchDuas(query, allDuas, 8);
        setResults(res);
        setIsOpen(res.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, allDuas]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);
      setQuery('');
      setResults([]);
      router.push(`/chapter/${result.dua.chapterId}`);
    },
    [router]
  );

  const getMatchBadge = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return null;
      case 'synonym':
        return (
          <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Text style={[styles.badgeText, { color: themeColors.primary }]}>Related</Text>
          </View>
        );
      case 'fuzzy':
        return (
          <View style={[styles.badge, { backgroundColor: 'rgba(212, 175, 55, 0.15)' }]}>
            <Text style={[styles.badgeText, { color: themeColors.accent }]}>Similar</Text>
          </View>
        );
      case 'chapter':
        return (
          <View style={[styles.badge, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
            <Text style={[styles.badgeText, { color: '#818CF8' }]}>Chapter</Text>
          </View>
        );
    }
  };

  const renderResult = useCallback(
    ({ item }: { item: SearchResult }) => {
      const chapter = getChapterById(item.dua.chapterId);
      const snippet = item.dua.translation && item.dua.translation.length > 100
        ? `${item.dua.translation.substring(0, 100)}...`
        : item.dua.translation || item.dua.transliteration || 'View dua';

      return (
        <Pressable
          style={({ pressed }) => [
            styles.resultItem,
            { borderBottomColor: themeColors.border },
            pressed && { backgroundColor: themeColors.surfaceElevated },
          ]}
          onPress={() => navigateToResult(item)}
        >
          <View style={styles.resultHeader}>
            <Text
              style={[styles.resultChapter, { color: themeColors.primary }]}
              numberOfLines={1}
            >
              {chapter?.titleEn || `Chapter ${item.dua.chapterId}`}
            </Text>
            {getMatchBadge(item.matchType)}
          </View>
          <Text
            style={[styles.resultSnippet, { color: themeColors.textMuted }]}
            numberOfLines={1}
          >
            {snippet}
          </Text>
        </Pressable>
      );
    },
    [themeColors, navigateToResult]
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.surface,
            borderColor: isOpen ? themeColors.primary : themeColors.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={themeColors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder="Search duas (e.g. 'forgiveness', 'salah', 'travel')..."
          placeholderTextColor={themeColors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Delay close so taps on results register
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
        {Platform.OS === 'android' && query.length > 0 && (
          <Pressable
            onPress={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color={themeColors.textMuted} />
          </Pressable>
        )}
      </View>

      {isOpen && results.length > 0 && (
        <View
          style={[
            styles.resultsContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
              shadowColor: themeColors.text,
            },
          ]}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.dua.id}
            renderItem={renderResult}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 300 }}
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
    borderRadius: borderRadius.full,
    borderWidth: 1,
    height: 50,
  },
  searchIcon: {
    marginRight: spacing.sm,
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
    top: 56,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultChapter: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultSnippet: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
  },
});
