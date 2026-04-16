// Enhanced storage layer with new V1 features
import { getSettings, getAllPageData, getDailyLogs, saveDailyLog, type ConfidenceLevel, type DailyLog } from './storage';

// Mistake types
export type MistakeType = 'saktah' | 'lahm' | 'other';

export interface PageMistake {
  page: number;
  ayahNumber?: number;
  wordIndex?: number;
  type: MistakeType;
  timestamp: string;
  notes?: string;
}

export interface ConnectionFlag {
  fromPage: number;
  toPage: number;
  notes?: string;
  lastPracticed?: string;
  timesReviewed: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  totalDaysCompleted: number;
}

export interface MushafLayout {
  type: '13-line' | '15-line';
  totalPages: number;
}

const KEYS = {
  mistakes: 'hifz-mistakes',
  connections: 'hifz-connections',
  streak: 'hifz-streak',
  layout: 'hifz-layout',
  mutashaabihaat: 'hifz-mutashaabihaat-bookmarks',
};

// Mistake tracking
export function getAllMistakes(): PageMistake[] {
  const raw = localStorage.getItem(KEYS.mistakes);
  return raw ? JSON.parse(raw) : [];
}

export function getMistakesForPage(page: number): PageMistake[] {
  return getAllMistakes().filter(m => m.page === page);
}

export function addMistake(mistake: PageMistake): void {
  const mistakes = getAllMistakes();
  mistakes.push(mistake);
  localStorage.setItem(KEYS.mistakes, JSON.stringify(mistakes));
}

export function deleteMistake(timestamp: string): void {
  const mistakes = getAllMistakes().filter(m => m.timestamp !== timestamp);
  localStorage.setItem(KEYS.mistakes, JSON.stringify(mistakes));
}

export function clearMistakesForPage(page: number): void {
  const mistakes = getAllMistakes().filter(m => m.page !== page);
  localStorage.setItem(KEYS.mistakes, JSON.stringify(mistakes));
}

// Connection flags
export function getAllConnections(): ConnectionFlag[] {
  const raw = localStorage.getItem(KEYS.connections);
  return raw ? JSON.parse(raw) : [];
}

export function getConnectionsForPage(page: number): ConnectionFlag[] {
  return getAllConnections().filter(c => c.fromPage === page || c.toPage === page);
}

export function addConnection(connection: ConnectionFlag): void {
  const connections = getAllConnections();
  // Check if connection already exists
  const existing = connections.findIndex(
    c => c.fromPage === connection.fromPage && c.toPage === connection.toPage
  );
  if (existing >= 0) {
    connections[existing] = connection;
  } else {
    connections.push(connection);
  }
  localStorage.setItem(KEYS.connections, JSON.stringify(connections));
}

export function deleteConnection(fromPage: number, toPage: number): void {
  const connections = getAllConnections().filter(
    c => !(c.fromPage === fromPage && c.toPage === toPage)
  );
  localStorage.setItem(KEYS.connections, JSON.stringify(connections));
}

export function incrementConnectionPractice(fromPage: number, toPage: number): void {
  const connections = getAllConnections();
  const connection = connections.find(
    c => c.fromPage === fromPage && c.toPage === toPage
  );
  if (connection) {
    connection.timesReviewed += 1;
    connection.lastPracticed = new Date().toISOString().split('T')[0];
    localStorage.setItem(KEYS.connections, JSON.stringify(connections));
  }
}

// Streak tracking
export function getStreak(): StreakData {
  const raw = localStorage.getItem(KEYS.streak);
  return raw ? JSON.parse(raw) : {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    totalDaysCompleted: 0,
  };
}

export function updateStreak(completedToday: boolean): StreakData {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreak();
  
  // If already updated today, return current
  if (streak.lastCompletionDate === today) {
    return streak;
  }
  
  if (completedToday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if yesterday was completed (consecutive)
    if (streak.lastCompletionDate === yesterdayStr) {
      streak.currentStreak += 1;
    } else if (streak.lastCompletionDate !== today) {
      // Streak broken, start new
      streak.currentStreak = 1;
    }
    
    streak.lastCompletionDate = today;
    streak.totalDaysCompleted += 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  }
  
  localStorage.setItem(KEYS.streak, JSON.stringify(streak));
  return streak;
}

export function checkAndUpdateStreak(): StreakData {
  const streak = getStreak();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if today's plan is complete
  const todayLog = getDailyLogs().find(l => l.date === today);
  if (!todayLog) return streak;
  
  const settings = getSettings();
  if (!settings) return streak;
  
  // Consider complete if at least one pile was done
  const anyComplete = todayLog.sabbakCompleted.length > 0 || 
                      todayLog.sabqiCompleted.length > 0 || 
                      todayLog.manzilCompleted.length > 0;
  
  if (anyComplete && streak.lastCompletionDate !== today) {
    return updateStreak(true);
  }
  
  // Check if streak should break
  if (streak.lastCompletionDate) {
    const lastDate = new Date(streak.lastCompletionDate);
    const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince > 1) {
      // Streak broken
      streak.currentStreak = 0;
      localStorage.setItem(KEYS.streak, JSON.stringify(streak));
    }
  }
  
  return streak;
}

// Mushaf layout
export function getMushafLayout(): MushafLayout {
  const raw = localStorage.getItem(KEYS.layout);
  return raw ? JSON.parse(raw) : { type: '15-line', totalPages: 604 };
}

export function setMushafLayout(layout: MushafLayout): void {
  localStorage.setItem(KEYS.layout, JSON.stringify(layout));
}

// Mutashaabihaat bookmarks
export interface MutashaabihBookmark {
  verse1: { surah: number; ayah: number; page: number };
  verse2: { surah: number; ayah: number; page: number };
  notes?: string;
}

export function getMutashaabihBookmarks(): MutashaabihBookmark[] {
  const raw = localStorage.getItem(KEYS.mutashaabihaat);
  return raw ? JSON.parse(raw) : [];
}

export function addMutashaabihBookmark(bookmark: MutashaabihBookmark): void {
  const bookmarks = getMutashaabihBookmarks();
  bookmarks.push(bookmark);
  localStorage.setItem(KEYS.mutashaabihaat, JSON.stringify(bookmarks));
}

export function deleteMutashaabihBookmark(index: number): void {
  const bookmarks = getMutashaabihBookmarks();
  bookmarks.splice(index, 1);
  localStorage.setItem(KEYS.mutashaabihaat, JSON.stringify(bookmarks));
}
