/**
 * Smart Search Engine for dua.fyi Mobile
 * Ported from website's searchEngine.ts
 *
 * Features:
 * - Synonym/related word expansion (Islamic terminology aware)
 * - Fuzzy matching for typos (Levenshtein distance)
 * - Chapter title search
 * - Word-level matching
 * - Relevance scoring and ranking
 * - Multi-word query support
 * - Per-chapter deduplication (max 2 results per chapter)
 */

import { Dua, Chapter } from '@/src/data/types';
import { chapters } from '@/src/data';

// ─── Islamic Synonym & Related Word Dictionary ─────────────────────────────
const SYNONYM_MAP: Record<string, string[]> = {
  // Prayer & Worship
  'prayer': ['salah', 'salat', 'namaz', 'pray', 'praying', 'worship', 'supplication', 'dua', 'invocation'],
  'salah': ['prayer', 'salat', 'namaz', 'pray'],
  'salat': ['prayer', 'salah', 'namaz', 'pray'],
  'namaz': ['prayer', 'salah', 'salat', 'pray'],
  'dua': ['supplication', 'prayer', 'invocation', 'plea', 'asking'],
  'supplication': ['dua', 'prayer', 'invocation', 'plea', 'asking'],
  'invocation': ['dua', 'supplication', 'prayer', 'dhikr'],
  'dhikr': ['remembrance', 'adhkar', 'zikr', 'thikr', 'mention', 'invocation'],
  'adhkar': ['dhikr', 'remembrance', 'zikr', 'thikr'],
  'remembrance': ['dhikr', 'adhkar', 'zikr'],
  'worship': ['ibadah', 'prayer', 'devotion'],

  // Prostration & Bowing
  'prostration': ['sujood', 'sajdah', 'prostrate', 'sajda'],
  'sujood': ['prostration', 'sajdah', 'prostrate'],
  'sajdah': ['prostration', 'sujood', 'prostrate'],
  'bowing': ['ruku', 'rukoo', 'bow'],
  'ruku': ['bowing', 'rukoo', 'bow'],

  // Forgiveness & Repentance
  'forgiveness': ['maghfirah', 'forgive', 'pardon', 'mercy', 'repentance', 'istighfar', 'tawbah'],
  'forgive': ['forgiveness', 'pardon', 'mercy', 'repentance'],
  'repentance': ['tawbah', 'taubah', 'forgiveness', 'istighfar', 'repent'],
  'tawbah': ['repentance', 'taubah', 'forgiveness', 'repent'],
  'istighfar': ['forgiveness', 'repentance', 'astaghfirullah'],
  'mercy': ['rahmah', 'merciful', 'compassion', 'forgiveness', 'kindness'],
  'rahmah': ['mercy', 'merciful', 'compassion'],

  // Morning & Evening
  'morning': ['fajr', 'dawn', 'sunrise', 'subh', 'sabah'],
  'evening': ['maghrib', 'sunset', 'dusk', 'night', 'masaa'],
  'night': ['layl', 'evening', 'sleep', 'bedtime', 'nighttime'],
  'sleep': ['sleeping', 'bed', 'bedtime', 'night', 'rest', 'slumber', 'waking'],
  'waking': ['wake', 'wakeup', 'rising', 'morning', 'sleep'],
  'dawn': ['fajr', 'morning', 'sunrise'],
  'fajr': ['dawn', 'morning', 'sunrise'],

  // Protection & Refuge
  'protection': ['refuge', 'shield', 'safeguard', 'preserve', 'guard', 'safe'],
  'refuge': ['protection', 'shelter', 'shield', 'seeking refuge'],
  'evil': ['harm', 'bad', 'wicked', 'shaytan', 'devil', 'satan', 'sin'],
  'devil': ['shaytan', 'shaitan', 'satan', 'iblis', 'evil', 'jinn'],
  'shaytan': ['devil', 'shaitan', 'satan', 'iblis'],

  // Travel
  'travel': ['journey', 'trip', 'traveling', 'traveler', 'safar', 'voyage'],
  'journey': ['travel', 'trip', 'traveling', 'safar'],
  'traveler': ['travel', 'journey', 'musafir', 'wayfarer'],

  // Food & Drink
  'food': ['eating', 'meal', 'eat', 'dining', 'breakfast', 'dinner', 'lunch'],
  'eating': ['food', 'meal', 'eat', 'dining'],
  'drink': ['drinking', 'water', 'beverage'],
  'fasting': ['sawm', 'siyam', 'fast', 'ramadan', 'iftar'],
  'fast': ['fasting', 'sawm', 'siyam'],
  'iftar': ['breaking fast', 'fasting', 'fast'],

  // Distress & Hardship
  'distress': ['anxiety', 'worry', 'grief', 'sorrow', 'hardship', 'difficulty', 'trouble', 'affliction'],
  'anxiety': ['distress', 'worry', 'fear', 'concern', 'stress', 'anguish'],
  'worry': ['anxiety', 'distress', 'concern', 'grief', 'stress'],
  'grief': ['sorrow', 'sadness', 'distress', 'mourning', 'loss'],
  'sorrow': ['grief', 'sadness', 'distress', 'mourning'],
  'hardship': ['difficulty', 'distress', 'trial', 'tribulation', 'affliction', 'trouble'],
  'difficulty': ['hardship', 'distress', 'trouble', 'problem'],
  'fear': ['anxiety', 'scared', 'afraid', 'fright', 'apprehension', 'terror'],
  'anger': ['angry', 'rage', 'fury', 'wrath', 'upset', 'mad'],
  'angry': ['anger', 'rage', 'fury', 'wrath', 'upset'],
  'patience': ['sabr', 'patient', 'endurance', 'perseverance', 'steadfast'],
  'sabr': ['patience', 'patient', 'endurance'],

  // Death & Funeral
  'death': ['dying', 'deceased', 'dead', 'funeral', 'burial', 'grave', 'janazah'],
  'funeral': ['janazah', 'death', 'burial', 'deceased', 'grave'],
  'janazah': ['funeral', 'death', 'burial'],
  'grave': ['burial', 'cemetery', 'death', 'qabr'],
  'burial': ['grave', 'funeral', 'death', 'bury'],
  'sick': ['illness', 'ill', 'disease', 'unwell', 'health', 'patient', 'ailment'],
  'illness': ['sick', 'ill', 'disease', 'unwell', 'sickness'],
  'health': ['sick', 'illness', 'wellbeing', 'cure', 'healing'],

  // Marriage & Family
  'marriage': ['wedding', 'married', 'nikah', 'spouse', 'husband', 'wife', 'newlywed'],
  'wedding': ['marriage', 'nikah', 'newlywed'],
  'nikah': ['marriage', 'wedding', 'newlywed'],
  'children': ['child', 'kids', 'offspring', 'son', 'daughter', 'baby', 'newborn'],
  'child': ['children', 'kids', 'baby', 'offspring'],
  'baby': ['newborn', 'child', 'children', 'birth', 'infant'],
  'birth': ['baby', 'newborn', 'child', 'born'],

  // Mosque
  'mosque': ['masjid', 'prayer hall', 'musalla'],
  'masjid': ['mosque', 'prayer hall'],

  // Islamic Concepts
  'allah': ['god', 'lord', 'rabb', 'creator', 'almighty'],
  'god': ['allah', 'lord', 'rabb', 'creator'],
  'prophet': ['muhammad', 'nabi', 'rasul', 'messenger'],
  'muhammad': ['prophet', 'nabi', 'rasul', 'messenger'],
  'quran': ['book', 'scripture', 'recitation', 'tilawah'],
  'paradise': ['jannah', 'heaven', 'garden', 'hereafter'],
  'jannah': ['paradise', 'heaven', 'garden'],
  'hellfire': ['jahannam', 'hell', 'fire', 'punishment'],
  'jahannam': ['hellfire', 'hell', 'fire'],

  // Home & Daily
  'home': ['house', 'dwelling', 'residence', 'entering home', 'leaving home'],
  'clothes': ['clothing', 'dress', 'dressing', 'garment', 'wear', 'attire'],
  'dressing': ['clothes', 'clothing', 'dress', 'garment', 'wear'],
  'restroom': ['bathroom', 'toilet', 'lavatory', 'washroom'],
  'bathroom': ['restroom', 'toilet', 'lavatory', 'washroom'],
  'toilet': ['restroom', 'bathroom', 'lavatory', 'washroom'],
  'ablution': ['wudu', 'wudhu', 'wuzu', 'purification', 'cleansing'],
  'wudu': ['ablution', 'wudhu', 'wuzu', 'purification'],

  // Weather
  'rain': ['rainfall', 'raining', 'storm', 'water', 'shower'],
  'wind': ['breeze', 'storm', 'gale', 'blowing'],
  'thunder': ['storm', 'lightning', 'thunderstorm'],

  // Gratitude & Praise
  'praise': ['hamd', 'alhamdulillah', 'glorify', 'thank', 'gratitude', 'laud'],
  'gratitude': ['thankful', 'thanks', 'grateful', 'shukr', 'praise'],
  'thank': ['gratitude', 'thankful', 'grateful', 'shukr'],
  'shukr': ['gratitude', 'thankful', 'grateful', 'thanks'],
  'glory': ['glorify', 'subhanallah', 'tasbeeh', 'exalted', 'praise'],
  'tasbeeh': ['glory', 'glorify', 'subhanallah', 'praise'],

  // Guidance & Knowledge
  'guidance': ['hidayah', 'guide', 'right path', 'direction', 'straight path'],
  'hidayah': ['guidance', 'guide', 'right path'],
  'knowledge': ['ilm', 'wisdom', 'understanding', 'learn', 'learning'],

  // Sin & Good deeds
  'sin': ['sins', 'sinful', 'transgression', 'wrongdoing', 'mistake', 'evil', 'disobedience'],
  'debt': ['loan', 'owe', 'owing', 'borrow', 'financial'],

  // Adhan & Prayer times
  'adhan': ['azan', 'athan', 'call to prayer', 'muezzin'],
  'azan': ['adhan', 'athan', 'call to prayer'],

  // Istikharah
  'istikharah': ['istikhara', 'guidance prayer', 'decision', 'choosing'],
  'istikhara': ['istikharah', 'guidance prayer', 'decision'],

  // Sneezing
  'sneeze': ['sneezing', 'alhamdulillah', 'yarhamukallah'],
  'sneezing': ['sneeze', 'alhamdulillah'],

  // Market
  'market': ['shopping', 'marketplace', 'bazaar', 'souq', 'buying', 'selling'],
  'shopping': ['market', 'marketplace', 'buying'],

  // Condolence
  'condolence': ['consolation', 'sympathy', 'comfort', 'bereaved', 'loss', 'death'],

  // Dream
  'dream': ['vision', 'nightmare', 'sleep', 'dreaming'],
  'nightmare': ['dream', 'bad dream', 'fear', 'sleep'],
};

// ─── Fuzzy Match Utility (Levenshtein) ──────────────────────────────────────
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function isFuzzyMatch(word: string, target: string, maxDistance: number = 2): boolean {
  if (word.length <= 3) {
    return levenshteinDistance(word, target) <= 1;
  }
  return levenshteinDistance(word, target) <= maxDistance;
}

// ─── Search Result Interface ────────────────────────────────────────────────
export interface SearchResult {
  dua: Dua;
  score: number;
  matchType: 'exact' | 'synonym' | 'fuzzy' | 'chapter';
  chapterTitle?: string;
}

// ─── Expand Query with Synonyms ─────────────────────────────────────────────
function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const expanded = new Set<string>(words);

  for (const word of words) {
    if (SYNONYM_MAP[word]) {
      for (const synonym of SYNONYM_MAP[word]) {
        expanded.add(synonym);
      }
    }

    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (synonyms.includes(word)) {
        expanded.add(key);
        for (const syn of synonyms) {
          expanded.add(syn);
        }
      }
    }
  }

  return Array.from(expanded);
}

// ─── Score a Dua Against Search Terms ───────────────────────────────────────
function scoreDua(
  dua: Dua,
  originalWords: string[],
  expandedTerms: string[],
  chapter: Chapter | undefined
): SearchResult | null {
  let score = 0;
  let matchType: SearchResult['matchType'] = 'fuzzy';

  const translation = (dua.translation || '').toLowerCase();
  const transliteration = (dua.transliteration || '').toLowerCase();
  const arabic = dua.arabic || '';
  const chapterTitle = (chapter?.titleEn || '').toLowerCase();
  const chapterTitleAr = chapter?.titleAr || '';

  const originalQuery = originalWords.join(' ');

  // 1. Chapter title matches (highest priority)
  if (chapterTitle.includes(originalQuery)) {
    score += 150;
    matchType = 'exact';
  }
  if (chapterTitleAr.includes(originalQuery)) {
    score += 140;
    matchType = 'exact';
  }

  for (const word of originalWords) {
    if (chapterTitle.includes(word)) {
      score += 50;
      if (matchType !== 'exact') matchType = 'chapter';
    }
    if (chapterTitleAr.includes(word)) {
      score += 45;
      if (matchType !== 'exact') matchType = 'chapter';
    }
  }

  // 2. Exact phrase match in dua text
  if (translation.includes(originalQuery)) {
    score += 80;
    if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'exact';
  }
  if (transliteration.includes(originalQuery)) {
    score += 70;
    if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'exact';
  }
  if (arabic.includes(originalQuery)) {
    score += 65;
    if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'exact';
  }

  // 3. Individual original word matches
  for (const word of originalWords) {
    if (translation.includes(word)) {
      score += 25;
      if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'exact';
    }
    if (transliteration.includes(word)) {
      score += 20;
      if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'exact';
    }
  }

  // 4. Synonym/related word matches
  const synonymTerms = expandedTerms.filter(t => !originalWords.includes(t));
  for (const term of synonymTerms) {
    if (chapterTitle.includes(term)) {
      score += 35;
      if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'synonym';
    }
    if (translation.includes(term)) {
      score += 15;
      if (matchType !== 'exact' && matchType !== 'chapter') matchType = 'synonym';
    }
    if (transliteration.includes(term)) {
      score += 12;
      if (matchType !== 'exact' && matchType !== 'chapter' && matchType !== 'synonym') matchType = 'synonym';
    }
  }

  // 5. Fuzzy matching for typo tolerance
  if (score === 0) {
    const chapterWords = chapterTitle.split(/\s+/);
    const translationWords = translation.split(/\s+/);
    const transliterationWords = transliteration.split(/\s+/);

    for (const queryWord of originalWords) {
      if (queryWord.length < 3) continue;

      for (const cw of chapterWords) {
        if (cw.length >= 3 && isFuzzyMatch(queryWord, cw)) {
          score += 12;
          matchType = 'fuzzy';
        }
      }
      for (const tw of translationWords) {
        if (tw.length >= 3 && isFuzzyMatch(queryWord, tw)) {
          score += 8;
          matchType = 'fuzzy';
        }
      }
      for (const tw of transliterationWords) {
        if (tw.length >= 3 && isFuzzyMatch(queryWord, tw)) {
          score += 6;
          matchType = 'fuzzy';
        }
      }
    }
  }

  if (score === 0) return null;

  return {
    dua,
    score,
    matchType,
    chapterTitle: chapter?.titleEn,
  };
}

// ─── Main Smart Search Function ─────────────────────────────────────────────
export function smartSearchDuas(
  query: string,
  allDuas: Dua[],
  limit: number = 8
): SearchResult[] {
  if (!query || !query.trim()) return [];

  const originalWords = query.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
  const expandedTerms = expandQuery(query);

  const results: SearchResult[] = [];

  for (const dua of allDuas) {
    const chapter = chapters.find(c => c.id === dua.chapterId);
    const result = scoreDua(dua, originalWords, expandedTerms, chapter);
    if (result) {
      results.push(result);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Deduplicate: max 2 results per chapter for variety
  const seen = new Map<number, number>();
  const deduped: SearchResult[] = [];

  for (const result of results) {
    const chapterId = result.dua.chapterId;
    const count = seen.get(chapterId) || 0;

    if (count < 2) {
      deduped.push(result);
      seen.set(chapterId, count + 1);
    }

    if (deduped.length >= limit) break;
  }

  return deduped;
}
