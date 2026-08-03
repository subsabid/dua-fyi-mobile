import { create } from 'zustand';
import { database } from '@/src/lib/database';
import { getDuasByChapter } from '@/src/data';
import { Dua } from '@/src/data/types';

interface FavoritesState {
  favoriteIds: Set<string>;
  isLoaded: boolean;

  // Actions
  initialize: () => Promise<void>;
  toggleFavorite: (duaId: string, chapterId: number) => Promise<void>;
  isFavorite: (duaId: string) => boolean;
  getFavoriteDuas: () => Promise<Dua[]>;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set<string>(),
  isLoaded: false,

  initialize: async () => {
    try {
      await database.initialize();
      const ids = await database.getAllFavoriteIds();
      set({ favoriteIds: new Set(ids), isLoaded: true });
    } catch (error) {
      console.error('Failed to initialize favorites:', error);
      set({ isLoaded: true });
    }
  },

  toggleFavorite: async (duaId: string, chapterId: number) => {
    const { favoriteIds } = get();
    const newFavorites = new Set(favoriteIds);
    
    if (newFavorites.has(duaId)) {
      newFavorites.delete(duaId);
      await database.removeFavorite(duaId);
    } else {
      newFavorites.add(duaId);
      await database.addFavorite(duaId, chapterId);
    }
    
    set({ favoriteIds: newFavorites });
  },

  isFavorite: (duaId: string) => {
    return get().favoriteIds.has(duaId);
  },

  getFavoriteDuas: async () => {
    const favorites = await database.getAllFavorites();
    const duas: Dua[] = [];
    
    for (const fav of favorites) {
      const chapterDuas = getDuasByChapter(fav.chapterId);
      const dua = chapterDuas.find(d => d.id === fav.duaId);
      if (dua) duas.push(dua);
    }
    
    return duas;
  },

  getFavoriteCount: () => {
    return get().favoriteIds.size;
  },
}));
