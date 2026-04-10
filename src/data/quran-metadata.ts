// Surah metadata: name, arabic name, total ayahs, start page (15-line Madinah Mushaf)
export interface SurahInfo {
  number: number;
  name: string;
  arabicName: string;
  totalAyahs: number;
  startPage: number;
}

export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const PAGES_PER_JUZ = Math.ceil(TOTAL_PAGES / TOTAL_JUZ); // ~20

export const SURAHS: SurahInfo[] = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", totalAyahs: 7, startPage: 1 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", totalAyahs: 286, startPage: 2 },
  { number: 3, name: "Ali 'Imran", arabicName: "آل عمران", totalAyahs: 200, startPage: 50 },
  { number: 4, name: "An-Nisa", arabicName: "النساء", totalAyahs: 176, startPage: 77 },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", totalAyahs: 120, startPage: 106 },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", totalAyahs: 165, startPage: 128 },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", totalAyahs: 206, startPage: 151 },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", totalAyahs: 75, startPage: 177 },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", totalAyahs: 129, startPage: 187 },
  { number: 10, name: "Yunus", arabicName: "يونس", totalAyahs: 109, startPage: 208 },
  { number: 11, name: "Hud", arabicName: "هود", totalAyahs: 123, startPage: 221 },
  { number: 12, name: "Yusuf", arabicName: "يوسف", totalAyahs: 111, startPage: 235 },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", totalAyahs: 43, startPage: 249 },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", totalAyahs: 52, startPage: 255 },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", totalAyahs: 99, startPage: 262 },
  { number: 16, name: "An-Nahl", arabicName: "النحل", totalAyahs: 128, startPage: 267 },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", totalAyahs: 111, startPage: 282 },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", totalAyahs: 110, startPage: 293 },
  { number: 19, name: "Maryam", arabicName: "مريم", totalAyahs: 98, startPage: 305 },
  { number: 20, name: "Taha", arabicName: "طه", totalAyahs: 135, startPage: 312 },
  { number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", totalAyahs: 112, startPage: 322 },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", totalAyahs: 78, startPage: 332 },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", totalAyahs: 118, startPage: 342 },
  { number: 24, name: "An-Nur", arabicName: "النور", totalAyahs: 64, startPage: 350 },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", totalAyahs: 77, startPage: 359 },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", totalAyahs: 227, startPage: 367 },
  { number: 27, name: "An-Naml", arabicName: "النمل", totalAyahs: 93, startPage: 377 },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", totalAyahs: 88, startPage: 385 },
  { number: 29, name: "Al-Ankabut", arabicName: "العنكبوت", totalAyahs: 69, startPage: 396 },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", totalAyahs: 60, startPage: 404 },
  { number: 31, name: "Luqman", arabicName: "لقمان", totalAyahs: 34, startPage: 411 },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", totalAyahs: 30, startPage: 415 },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", totalAyahs: 73, startPage: 418 },
  { number: 34, name: "Saba", arabicName: "سبأ", totalAyahs: 54, startPage: 428 },
  { number: 35, name: "Fatir", arabicName: "فاطر", totalAyahs: 45, startPage: 434 },
  { number: 36, name: "Ya-Sin", arabicName: "يس", totalAyahs: 83, startPage: 440 },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", totalAyahs: 182, startPage: 446 },
  { number: 38, name: "Sad", arabicName: "ص", totalAyahs: 88, startPage: 453 },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", totalAyahs: 75, startPage: 458 },
  { number: 40, name: "Ghafir", arabicName: "غافر", totalAyahs: 85, startPage: 467 },
  { number: 41, name: "Fussilat", arabicName: "فصلت", totalAyahs: 54, startPage: 477 },
  { number: 42, name: "Ash-Shura", arabicName: "الشورى", totalAyahs: 53, startPage: 483 },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", totalAyahs: 89, startPage: 489 },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", totalAyahs: 59, startPage: 496 },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", totalAyahs: 37, startPage: 499 },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", totalAyahs: 35, startPage: 502 },
  { number: 47, name: "Muhammad", arabicName: "محمد", totalAyahs: 38, startPage: 507 },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", totalAyahs: 29, startPage: 511 },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", totalAyahs: 18, startPage: 515 },
  { number: 50, name: "Qaf", arabicName: "ق", totalAyahs: 45, startPage: 518 },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", totalAyahs: 60, startPage: 520 },
  { number: 52, name: "At-Tur", arabicName: "الطور", totalAyahs: 49, startPage: 523 },
  { number: 53, name: "An-Najm", arabicName: "النجم", totalAyahs: 62, startPage: 526 },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", totalAyahs: 55, startPage: 528 },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", totalAyahs: 78, startPage: 531 },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", totalAyahs: 96, startPage: 534 },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", totalAyahs: 29, startPage: 537 },
  { number: 58, name: "Al-Mujadila", arabicName: "المجادلة", totalAyahs: 22, startPage: 542 },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", totalAyahs: 24, startPage: 545 },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", totalAyahs: 13, startPage: 549 },
  { number: 61, name: "As-Saf", arabicName: "الصف", totalAyahs: 14, startPage: 551 },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", totalAyahs: 11, startPage: 553 },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", totalAyahs: 11, startPage: 554 },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", totalAyahs: 18, startPage: 556 },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", totalAyahs: 12, startPage: 558 },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", totalAyahs: 12, startPage: 560 },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", totalAyahs: 30, startPage: 562 },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", totalAyahs: 52, startPage: 564 },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", totalAyahs: 52, startPage: 566 },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", totalAyahs: 44, startPage: 568 },
  { number: 71, name: "Nuh", arabicName: "نوح", totalAyahs: 28, startPage: 570 },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", totalAyahs: 28, startPage: 572 },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", totalAyahs: 20, startPage: 574 },
  { number: 74, name: "Al-Muddathir", arabicName: "المدثر", totalAyahs: 56, startPage: 575 },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", totalAyahs: 40, startPage: 577 },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", totalAyahs: 31, startPage: 578 },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", totalAyahs: 50, startPage: 580 },
  { number: 78, name: "An-Naba", arabicName: "النبأ", totalAyahs: 40, startPage: 582 },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", totalAyahs: 46, startPage: 583 },
  { number: 80, name: "Abasa", arabicName: "عبس", totalAyahs: 42, startPage: 585 },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", totalAyahs: 29, startPage: 586 },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", totalAyahs: 19, startPage: 587 },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", totalAyahs: 36, startPage: 587 },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", totalAyahs: 25, startPage: 589 },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", totalAyahs: 22, startPage: 590 },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", totalAyahs: 17, startPage: 591 },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", totalAyahs: 19, startPage: 591 },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", totalAyahs: 26, startPage: 592 },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", totalAyahs: 30, startPage: 593 },
  { number: 90, name: "Al-Balad", arabicName: "البلد", totalAyahs: 20, startPage: 594 },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", totalAyahs: 15, startPage: 595 },
  { number: 92, name: "Al-Layl", arabicName: "الليل", totalAyahs: 21, startPage: 595 },
  { number: 93, name: "Ad-Duha", arabicName: "الضحى", totalAyahs: 11, startPage: 596 },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", totalAyahs: 8, startPage: 596 },
  { number: 95, name: "At-Tin", arabicName: "التين", totalAyahs: 8, startPage: 597 },
  { number: 96, name: "Al-Alaq", arabicName: "العلق", totalAyahs: 19, startPage: 597 },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", totalAyahs: 5, startPage: 598 },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", totalAyahs: 8, startPage: 598 },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", totalAyahs: 8, startPage: 599 },
  { number: 100, name: "Al-Adiyat", arabicName: "العاديات", totalAyahs: 11, startPage: 599 },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", totalAyahs: 11, startPage: 600 },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", totalAyahs: 8, startPage: 600 },
  { number: 103, name: "Al-Asr", arabicName: "العصر", totalAyahs: 3, startPage: 601 },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", totalAyahs: 9, startPage: 601 },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", totalAyahs: 5, startPage: 601 },
  { number: 106, name: "Quraysh", arabicName: "قريش", totalAyahs: 4, startPage: 602 },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", totalAyahs: 7, startPage: 602 },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", totalAyahs: 3, startPage: 602 },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", totalAyahs: 6, startPage: 603 },
  { number: 110, name: "An-Nasr", arabicName: "النصر", totalAyahs: 3, startPage: 603 },
  { number: 111, name: "Al-Masad", arabicName: "المسد", totalAyahs: 5, startPage: 603 },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", totalAyahs: 4, startPage: 604 },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", totalAyahs: 5, startPage: 604 },
  { number: 114, name: "An-Nas", arabicName: "الناس", totalAyahs: 6, startPage: 604 },
];

// Get Juz number for a given page (1-indexed)
export function getJuzForPage(page: number): number {
  return Math.min(30, Math.ceil(page / PAGES_PER_JUZ));
}

// Get surah for a given page
export function getSurahForPage(page: number): SurahInfo {
  for (let i = SURAHS.length - 1; i >= 0; i--) {
    if (SURAHS[i].startPage <= page) return SURAHS[i];
  }
  return SURAHS[0];
}

// Get page range for a juz
export function getJuzPageRange(juz: number): { start: number; end: number } {
  const start = (juz - 1) * PAGES_PER_JUZ + 1;
  const end = Math.min(juz * PAGES_PER_JUZ, TOTAL_PAGES);
  return { start, end };
}
