import categoriesData from './categories.json';
import chaptersData from './chapters.json';
import { duas } from './duas';
import { Category, Chapter, Dua } from './types';

export const categories: Category[] = categoriesData as Category[];
export const chapters: Chapter[] = chaptersData as Chapter[];

export function getDuasByChapter(chapterId: number): Dua[] {
  return duas[chapterId] || [];
}

export function getChaptersByCategory(categoryIdOrSlug: string): Chapter[] {
  if (!categoryIdOrSlug) return [];
  const norm = categoryIdOrSlug.replace(/-/g, '_');
  const slugNorm = categoryIdOrSlug.replace(/_/g, '-');
  return chapters.filter(
    ch =>
      ch.categoryId === categoryIdOrSlug ||
      ch.categoryId === norm ||
      ch.categoryId === slugNorm
  );
}

export function getCategoryById(categoryIdOrSlug: string): Category | undefined {
  if (!categoryIdOrSlug) return undefined;
  const norm = categoryIdOrSlug.replace(/-/g, '_');
  const slugNorm = categoryIdOrSlug.replace(/_/g, '-');
  return categories.find(
    cat =>
      cat.id === categoryIdOrSlug ||
      cat.slug === categoryIdOrSlug ||
      cat.id === norm ||
      cat.slug === slugNorm
  );
}

export function getChapterById(chapterId: number): Chapter | undefined {
  return chapters.find(ch => ch.id === chapterId);
}

export function searchDuas(query: string): Dua[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const results: Dua[] = [];
  for (const chapterId in duas) {
    for (const dua of duas[chapterId]) {
      if (
        dua.arabic.includes(query) ||
        dua.transliteration.toLowerCase().includes(lowerQuery) ||
        dua.translation.toLowerCase().includes(lowerQuery)
      ) {
        results.push(dua);
      }
    }
  }
  return results;
}

export { type Category, type Chapter, type Dua } from './types';
