// Quran API integration using quran.com/api
// Provides ayah text, audio URLs, and metadata

export interface Ayah {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_indopak: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface PageData {
  ayahs: Ayah[];
  surah: Surah;
  page: number;
}

const API_BASE = 'https://api.quran.com/api/v4';

// Cache for API responses
const cache: Record<string, any> = {};

async function fetchWithCache(url: string): Promise<any> {
  if (cache[url]) {
    return cache[url];
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    cache[url] = data;
    return data;
  } catch (error) {
    console.error('Quran API error:', error);
    throw error;
  }
}

// Get all ayahs for a specific page (Madinah Mushaf)
export async function getPageAyahs(pageNumber: number): Promise<Ayah[]> {
  try {
    const url = `${API_BASE}/verses/by_page/${pageNumber}?language=ar&words=false&translations=131&audio=7&fields=text_uthmani,verse_number,verse_key`;
    const data = await fetchWithCache(url);
    return data.verses || [];
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
}

// Get surah info
export async function getSurahInfo(surahNumber: number): Promise<Surah | null> {
  try {
    const url = `${API_BASE}/chapters/${surahNumber}?language=en`;
    const data = await fetchWithCache(url);
    return data.chapter || null;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    return null;
  }
}

// Get translation for an ayah
export async function getAyahTranslation(surahNumber: number, ayahNumber: number): Promise<string> {
  try {
    const url = `${API_BASE}/quran/translations/131?verse_key=${surahNumber}:${ayahNumber}`;
    const data = await fetchWithCache(url);
    return data.translations?.[0]?.text || '';
  } catch (error) {
    console.error(`Error fetching translation:`, error);
    return '';
  }
}

// Get audio URL for an ayah
export function getAudioUrl(surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy'): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahNumber}/${ayahNumber}.mp3`;
}

// Get word-by-word breakdown (optional, for contextual aid)
export async function getAyahWords(surahNumber: number, ayahNumber: number): Promise<any[]> {
  try {
    const url = `${API_BASE}/verses/by_key/${surahNumber}:${ayahNumber}?language=en&words=true&word_fields=text_uthmani,translation`;
    const data = await fetchWithCache(url);
    return data.verse?.words || [];
  } catch (error) {
    console.error('Error fetching word breakdown:', error);
    return [];
  }
}

// Get tafsir for an ayah (using Tafsir Al-Jalalayn as example)
export async function getAyahTafsir(surahNumber: number, ayahNumber: number): Promise<string> {
  try {
    const url = `${API_BASE}/tafsirs/169/by_ayah/${surahNumber}:${ayahNumber}`;
    const data = await fetchWithCache(url);
    return data.tafsir?.text || '';
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return '';
  }
}

// Simple mutashaabihaat detection (basic implementation)
// In production, this would use a dedicated database
export function findSimilarVerses(text: string): Array<{ surah: number; ayah: number; similarity: number }> {
  // This is a placeholder - a real implementation would:
  // 1. Have a pre-built database of similar verses
  // 2. Use text similarity algorithms
  // 3. Return actual matches
  
  // For now, return empty array
  return [];
}

// Utility: Extract ayah range for a page
export function getPageAyahRange(ayahs: Ayah[]): { 
  startSurah: number; 
  startAyah: number; 
  endSurah: number; 
  endAyah: number; 
} | null {
  if (ayahs.length === 0) return null;
  
  const first = ayahs[0];
  const last = ayahs[ayahs.length - 1];
  
  // Extract surah number from verse key (format: "surah:ayah")
  const firstKey = first.verse_key?.split(':') || ['1', '1'];
  const lastKey = last.verse_key?.split(':') || ['1', '1'];
  
  return {
    startSurah: parseInt(firstKey[0]),
    startAyah: parseInt(firstKey[1]),
    endSurah: parseInt(lastKey[0]),
    endAyah: parseInt(lastKey[1]),
  };
}

// Clear cache (useful for development)
export function clearQuranCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
}
