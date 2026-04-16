// Comprehensive Mutashaabihaat (Similar Verses) Database
// Based on authenticated Quran similarity data

export type SimilarityType = 'full' | 'partial';

export interface SimilarVerse {
  surah: number;
  ayah: number;
  type: SimilarityType;
  note?: string;
}

export interface MutashaabihEntry {
  surah: number;
  ayah: number;
  similarTo: SimilarVerse[];
}

// Full similarity database - verses that are exactly the same
export const FULL_SIMILARITIES: MutashaabihEntry[] = [
  // Baqarah
  { surah: 2, ayah: 1, similarTo: [
    { surah: 3, ayah: 1, type: 'full' },
    { surah: 29, ayah: 1, type: 'full' },
    { surah: 30, ayah: 1, type: 'full' },
    { surah: 31, ayah: 1, type: 'full' },
    { surah: 32, ayah: 1, type: 'full' },
  ]},
  { surah: 2, ayah: 5, similarTo: [{ surah: 2, ayah: 122, type: 'full' }]},
  { surah: 2, ayah: 134, similarTo: [{ surah: 2, ayah: 141, type: 'full' }]},
  { surah: 2, ayah: 162, similarTo: [{ surah: 3, ayah: 88, type: 'full' }]},

  // Al-Imran
  { surah: 3, ayah: 89, similarTo: [{ surah: 24, ayah: 5, type: 'full' }]},
  { surah: 3, ayah: 186, similarTo: [{ surah: 8, ayah: 51, type: 'full' }]},

  // Al-Ma'idah
  { surah: 5, ayah: 10, similarTo: [{ surah: 5, ayah: 86, type: 'full' }]},

  // Al-An'am
  { surah: 6, ayah: 4, similarTo: [{ surah: 36, ayah: 46, type: 'full' }]},
  { surah: 6, ayah: 10, similarTo: [{ surah: 21, ayah: 41, type: 'full' }]},
  { surah: 6, ayah: 15, similarTo: [{ surah: 39, ayah: 13, type: 'full' }]},

  // Al-A'raf
  { surah: 7, ayah: 107, similarTo: [{ surah: 26, ayah: 32, type: 'full' }]},
  { surah: 7, ayah: 108, similarTo: [{ surah: 26, ayah: 33, type: 'full' }]},
  { surah: 7, ayah: 121, similarTo: [{ surah: 26, ayah: 47, type: 'full' }]},
  { surah: 7, ayah: 122, similarTo: [{ surah: 26, ayah: 48, type: 'full' }]},
  { surah: 7, ayah: 183, similarTo: [{ surah: 68, ayah: 45, type: 'full' }]},

  // At-Tawbah
  { surah: 9, ayah: 73, similarTo: [{ surah: 66, ayah: 9, type: 'full' }]},

  // Yunus
  { surah: 10, ayah: 48, similarTo: [
    { surah: 21, ayah: 38, type: 'full' },
    { surah: 27, ayah: 71, type: 'full' },
    { surah: 27, ayah: 29, type: 'full' },
    { surah: 34, ayah: 48, type: 'full' },
    { surah: 36, ayah: 25, type: 'full' },
    { surah: 67, ayah: 25, type: 'full' },
  ]},

  // Hud
  { surah: 11, ayah: 96, similarTo: [{ surah: 40, ayah: 23, type: 'full' }]},
  { surah: 11, ayah: 110, similarTo: [{ surah: 41, ayah: 45, type: 'full' }]},

  // Ibrahim
  { surah: 14, ayah: 20, similarTo: [{ surah: 35, ayah: 17, type: 'full' }]},

  // Al-Hijr
  { surah: 15, ayah: 5, similarTo: [{ surah: 23, ayah: 43, type: 'full' }]},
  { surah: 15, ayah: 30, similarTo: [{ surah: 38, ayah: 73, type: 'full' }]},
  { surah: 15, ayah: 34, similarTo: [{ surah: 38, ayah: 77, type: 'full' }]},
  { surah: 15, ayah: 36, similarTo: [{ surah: 38, ayah: 79, type: 'full' }]},
  { surah: 15, ayah: 37, similarTo: [{ surah: 38, ayah: 80, type: 'full' }]},
  { surah: 15, ayah: 38, similarTo: [{ surah: 38, ayah: 81, type: 'full' }]},
  { surah: 15, ayah: 40, similarTo: [{ surah: 38, ayah: 83, type: 'full' }]},
  { surah: 15, ayah: 45, similarTo: [{ surah: 51, ayah: 15, type: 'full' }]},
  { surah: 15, ayah: 57, similarTo: [{ surah: 51, ayah: 31, type: 'full' }]},
  { surah: 15, ayah: 58, similarTo: [{ surah: 51, ayah: 32, type: 'full' }]},

  // An-Nahl
  { surah: 16, ayah: 42, similarTo: [{ surah: 29, ayah: 59, type: 'full' }]},
  { surah: 16, ayah: 55, similarTo: [{ surah: 30, ayah: 34, type: 'full' }]},

  // Al-Kahf
  { surah: 18, ayah: 89, similarTo: [{ surah: 18, ayah: 92, type: 'full' }]},

  // Ta-Ha
  { surah: 20, ayah: 24, similarTo: [{ surah: 79, ayah: 17, type: 'full' }]},

  // Al-Mu'minun
  { surah: 23, ayah: 5, similarTo: [{ surah: 70, ayah: 29, type: 'full' }]},
  { surah: 23, ayah: 6, similarTo: [{ surah: 70, ayah: 30, type: 'full' }]},
  { surah: 23, ayah: 7, similarTo: [{ surah: 70, ayah: 31, type: 'full' }]},
  { surah: 23, ayah: 8, similarTo: [{ surah: 70, ayah: 32, type: 'full' }]},
  { surah: 23, ayah: 26, similarTo: [{ surah: 23, ayah: 39, type: 'full' }]},

  // Ash-Shu'ara
  { surah: 26, ayah: 1, similarTo: [{ surah: 28, ayah: 1, type: 'full' }]},
  { surah: 26, ayah: 2, similarTo: [{ surah: 28, ayah: 2, type: 'full' }]},
  { surah: 26, ayah: 8, similarTo: [
    { surah: 26, ayah: 67, type: 'full' },
    { surah: 26, ayah: 103, type: 'full' },
    { surah: 26, ayah: 121, type: 'full' },
    { surah: 26, ayah: 174, type: 'full' },
    { surah: 26, ayah: 190, type: 'full' },
  ]},
  { surah: 26, ayah: 9, similarTo: [
    { surah: 26, ayah: 68, type: 'full' },
    { surah: 26, ayah: 104, type: 'full' },
    { surah: 26, ayah: 122, type: 'full' },
    { surah: 26, ayah: 140, type: 'full' },
    { surah: 26, ayah: 159, type: 'full' },
    { surah: 26, ayah: 175, type: 'full' },
    { surah: 26, ayah: 191, type: 'full' },
  ]},
  { surah: 26, ayah: 66, similarTo: [{ surah: 26, ayah: 82, type: 'full' }]},
  { surah: 26, ayah: 107, similarTo: [
    { surah: 26, ayah: 125, type: 'full' },
    { surah: 26, ayah: 143, type: 'full' },
    { surah: 26, ayah: 162, type: 'full' },
    { surah: 26, ayah: 178, type: 'full' },
  ]},
  { surah: 26, ayah: 108, similarTo: [
    { surah: 26, ayah: 110, type: 'full' },
    { surah: 26, ayah: 126, type: 'full' },
    { surah: 26, ayah: 131, type: 'full' },
    { surah: 26, ayah: 144, type: 'full' },
    { surah: 26, ayah: 150, type: 'full' },
    { surah: 26, ayah: 163, type: 'full' },
    { surah: 26, ayah: 179, type: 'full' },
  ]},
  { surah: 26, ayah: 147, similarTo: [{ surah: 44, ayah: 52, type: 'full' }]},
  { surah: 26, ayah: 154, similarTo: [{ surah: 26, ayah: 185, type: 'full' }]},
  { surah: 26, ayah: 171, similarTo: [{ surah: 37, ayah: 135, type: 'full' }]},
  { surah: 26, ayah: 172, similarTo: [{ surah: 37, ayah: 136, type: 'full' }]},
  { surah: 26, ayah: 173, similarTo: [{ surah: 27, ayah: 58, type: 'full' }]},
  { surah: 26, ayah: 204, similarTo: [{ surah: 37, ayah: 176, type: 'full' }]},

  // An-Naml
  { surah: 27, ayah: 3, similarTo: [{ surah: 31, ayah: 4, type: 'full' }]},

  // Al-Qasas
  { surah: 28, ayah: 62, similarTo: [{ surah: 28, ayah: 74, type: 'full' }]},

  // As-Saffat
  { surah: 37, ayah: 17, similarTo: [{ surah: 56, ayah: 48, type: 'full' }]},
  { surah: 37, ayah: 27, similarTo: [{ surah: 52, ayah: 25, type: 'full' }]},
  { surah: 37, ayah: 40, similarTo: [
    { surah: 37, ayah: 74, type: 'full' },
    { surah: 37, ayah: 128, type: 'full' },
    { surah: 37, ayah: 160, type: 'full' },
  ]},
  { surah: 37, ayah: 43, similarTo: [{ surah: 56, ayah: 12, type: 'full' }]},
  { surah: 37, ayah: 44, similarTo: [
    { surah: 37, ayah: 80, type: 'full' },
    { surah: 37, ayah: 121, type: 'full' },
    { surah: 37, ayah: 131, type: 'full' },
  ]},
  { surah: 37, ayah: 78, similarTo: [
    { surah: 37, ayah: 108, type: 'full' },
    { surah: 37, ayah: 129, type: 'full' },
  ]},
  { surah: 37, ayah: 80, similarTo: [
    { surah: 37, ayah: 121, type: 'full' },
    { surah: 37, ayah: 122, type: 'full' },
  ]},
  { surah: 37, ayah: 81, similarTo: [
    { surah: 37, ayah: 131, type: 'full' },
    { surah: 37, ayah: 132, type: 'full' },
  ]},

  // Sad
  { surah: 38, ayah: 87, similarTo: [{ surah: 81, ayah: 27, type: 'full' }]},

  // Az-Zumar
  { surah: 39, ayah: 1, similarTo: [
    { surah: 45, ayah: 2, type: 'full' },
    { surah: 46, ayah: 2, type: 'full' },
  ]},

  // Ghafir
  { surah: 40, ayah: 1, similarTo: [
    { surah: 41, ayah: 1, type: 'full' },
    { surah: 42, ayah: 1, type: 'full' },
    { surah: 43, ayah: 1, type: 'full' },
    { surah: 44, ayah: 1, type: 'full' },
    { surah: 45, ayah: 1, type: 'full' },
    { surah: 46, ayah: 1, type: 'full' },
  ]},

  // Az-Zukhruf
  { surah: 43, ayah: 2, similarTo: [{ surah: 44, ayah: 2, type: 'full' }]},
  { surah: 43, ayah: 83, similarTo: [{ surah: 70, ayah: 42, type: 'full' }]},

  // At-Tur
  { surah: 52, ayah: 19, similarTo: [{ surah: 77, ayah: 43, type: 'full' }]},
  { surah: 52, ayah: 40, similarTo: [{ surah: 68, ayah: 46, type: 'full' }]},
  { surah: 52, ayah: 41, similarTo: [{ surah: 68, ayah: 47, type: 'full' }]},

  // Al-Qamar
  { surah: 54, ayah: 16, similarTo: [
    { surah: 54, ayah: 21, type: 'full' },
    { surah: 54, ayah: 30, type: 'full' },
  ]},
  { surah: 54, ayah: 17, similarTo: [
    { surah: 54, ayah: 22, type: 'full' },
    { surah: 54, ayah: 32, type: 'full' },
    { surah: 54, ayah: 40, type: 'full' },
  ]},

  // Ar-Rahman
  { surah: 55, ayah: 13, similarTo: [
    { surah: 55, ayah: 16, type: 'full' },
    { surah: 55, ayah: 18, type: 'full' },
    { surah: 55, ayah: 21, type: 'full' },
    { surah: 55, ayah: 23, type: 'full' },
    { surah: 55, ayah: 25, type: 'full' },
    { surah: 55, ayah: 28, type: 'full' },
    { surah: 55, ayah: 30, type: 'full' },
    { surah: 55, ayah: 32, type: 'full' },
    { surah: 55, ayah: 34, type: 'full' },
    { surah: 55, ayah: 36, type: 'full' },
    { surah: 55, ayah: 38, type: 'full' },
    { surah: 55, ayah: 40, type: 'full' },
    { surah: 55, ayah: 42, type: 'full' },
    { surah: 55, ayah: 45, type: 'full' },
    { surah: 55, ayah: 47, type: 'full' },
    { surah: 55, ayah: 49, type: 'full' },
    { surah: 55, ayah: 51, type: 'full' },
    { surah: 55, ayah: 53, type: 'full' },
    { surah: 55, ayah: 55, type: 'full' },
    { surah: 55, ayah: 57, type: 'full' },
    { surah: 55, ayah: 59, type: 'full' },
    { surah: 55, ayah: 61, type: 'full' },
    { surah: 55, ayah: 63, type: 'full' },
    { surah: 55, ayah: 65, type: 'full' },
    { surah: 55, ayah: 67, type: 'full' },
    { surah: 55, ayah: 69, type: 'full' },
    { surah: 55, ayah: 71, type: 'full' },
    { surah: 55, ayah: 73, type: 'full' },
    { surah: 55, ayah: 75, type: 'full' },
    { surah: 55, ayah: 77, type: 'full' },
  ]},

  // Al-Waqi'ah
  { surah: 56, ayah: 13, similarTo: [{ surah: 56, ayah: 39, type: 'full' }]},
  { surah: 56, ayah: 67, similarTo: [{ surah: 68, ayah: 27, type: 'full' }]},
  { surah: 56, ayah: 74, similarTo: [
    { surah: 56, ayah: 96, type: 'full' },
    { surah: 69, ayah: 52, type: 'full' },
  ]},
  { surah: 56, ayah: 80, similarTo: [{ surah: 69, ayah: 43, type: 'full' }]},

  // Al-Hashr
  { surah: 59, ayah: 1, similarTo: [{ surah: 61, ayah: 1, type: 'full' }]},

  // Al-Qalam
  { surah: 68, ayah: 15, similarTo: [{ surah: 83, ayah: 13, type: 'full' }]},

  // Al-Haqqah
  { surah: 69, ayah: 21, similarTo: [{ surah: 101, ayah: 7, type: 'full' }]},
  { surah: 69, ayah: 22, similarTo: [{ surah: 88, ayah: 10, type: 'full' }]},
  { surah: 69, ayah: 34, similarTo: [{ surah: 107, ayah: 3, type: 'full' }]},
  { surah: 69, ayah: 40, similarTo: [{ surah: 81, ayah: 19, type: 'full' }]},

  // Al-Muzzammil
  { surah: 73, ayah: 19, similarTo: [{ surah: 76, ayah: 29, type: 'full' }]},

  // Al-Muddaththir
  { surah: 74, ayah: 55, similarTo: [{ surah: 80, ayah: 12, type: 'full' }]},

  // Al-Mursalat
  { surah: 77, ayah: 15, similarTo: [
    { surah: 77, ayah: 19, type: 'full' },
    { surah: 77, ayah: 24, type: 'full' },
    { surah: 77, ayah: 28, type: 'full' },
    { surah: 77, ayah: 34, type: 'full' },
    { surah: 77, ayah: 37, type: 'full' },
    { surah: 77, ayah: 40, type: 'full' },
    { surah: 77, ayah: 45, type: 'full' },
    { surah: 77, ayah: 47, type: 'full' },
    { surah: 77, ayah: 49, type: 'full' },
    { surah: 83, ayah: 10, type: 'full' },
  ]},

  // An-Nazi'at
  { surah: 79, ayah: 33, similarTo: [{ surah: 80, ayah: 32, type: 'full' }]},

  // Al-Infitar
  { surah: 82, ayah: 13, similarTo: [{ surah: 83, ayah: 22, type: 'full' }]},

  // Al-Mutaffifin
  { surah: 83, ayah: 9, similarTo: [{ surah: 83, ayah: 20, type: 'full' }]},
  { surah: 83, ayah: 23, similarTo: [{ surah: 83, ayah: 35, type: 'full' }]},

  // Al-Inshiqaq
  { surah: 84, ayah: 2, similarTo: [{ surah: 84, ayah: 5, type: 'full' }]},

  // Al-Kafirun
  { surah: 109, ayah: 3, similarTo: [{ surah: 109, ayah: 5, type: 'full' }]},
];

// Helper function to find all similar verses for a given ayah
export function findSimilarVerses(surah: number, ayah: number): SimilarVerse[] {
  // Find in main database
  const entry = FULL_SIMILARITIES.find(e => e.surah === surah && e.ayah === ayah);
  if (entry) {
    return entry.similarTo;
  }

  // Check reverse - if this verse is listed as similar to another
  const results: SimilarVerse[] = [];
  FULL_SIMILARITIES.forEach(entry => {
    entry.similarTo.forEach(similar => {
      if (similar.surah === surah && similar.ayah === ayah) {
        results.push({
          surah: entry.surah,
          ayah: entry.ayah,
          type: similar.type,
          note: similar.note,
        });
      }
    });
  });

  return results;
}

// Helper to get verse reference string
export function getVerseReference(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

// Helper to check if two verses are similar
export function areVersesSimilar(surah1: number, ayah1: number, surah2: number, ayah2: number): boolean {
  const similar = findSimilarVerses(surah1, ayah1);
  return similar.some(v => v.surah === surah2 && v.ayah === ayah2);
}

// Helper to get all verses that have similarities
export function getAllVersesWithSimilarities(): Array<{ surah: number; ayah: number }> {
  const verses = new Set<string>();
  
  FULL_SIMILARITIES.forEach(entry => {
    verses.add(`${entry.surah}:${entry.ayah}`);
    entry.similarTo.forEach(similar => {
      verses.add(`${similar.surah}:${similar.ayah}`);
    });
  });

  return Array.from(verses).map(ref => {
    const [surah, ayah] = ref.split(':').map(Number);
    return { surah, ayah };
  });
}
