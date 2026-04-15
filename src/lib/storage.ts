// Local storage persistence layer — privacy first, no cloud

export type ConfidenceLevel = 'weak' | 'medium' | 'strong';

export interface PageRevisionData {
  page: number;
  lastRevised: string | null; // ISO date
  confidence: ConfidenceLevel | null;
  revisionCount: number;
  mistakes: number;
}

export interface UserSettings {
  memorizedFrom: number; // start page
  memorizedTo: number;   // end page
  dailySabbakPages: number;  // new lesson pages per day
  sabqiDays: number;         // how many days back for Recent (default 7)
  dailyManzilPages: number;  // old/revision pages per day
  startDate: string;         // ISO date when user started
  onboardingComplete: boolean;
}

export interface DailyLog {
  date: string; // ISO date
  sabbakCompleted: number[];   // page numbers
  sabqiCompleted: number[];
  manzilCompleted: number[];
  missedDay: boolean;
}

export interface ConnectionFlag {
  fromPage: number;
  toPage: number;
  notes: string;
  createdAt: string;
}

const KEYS = {
  settings: 'hifz-settings',
  pageData: 'hifz-page-data',
  dailyLogs: 'hifz-daily-logs',
  currentManzilIndex: 'hifz-manzil-index',
  connectionFlags: 'hifz-connection-flags',
  streak: 'hifz-streak',
};

// Settings
export function getSettings(): UserSettings | null {
  const raw = localStorage.getItem(KEYS.settings);
  return raw ? JSON.parse(raw) : null;
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// Page data
export function getAllPageData(): Record<number, PageRevisionData> {
  const raw = localStorage.getItem(KEYS.pageData);
  return raw ? JSON.parse(raw) : {};
}

export function getPageData(page: number): PageRevisionData {
  const all = getAllPageData();
  return all[page] || { page, lastRevised: null, confidence: null, revisionCount: 0, mistakes: 0 };
}

export function savePageData(page: number, data: Partial<PageRevisionData>): void {
  const all = getAllPageData();
  const existing = getPageData(page);
  all[page] = { ...existing, ...data, page };
  localStorage.setItem(KEYS.pageData, JSON.stringify(all));
}

// Daily logs
export function getDailyLogs(): DailyLog[] {
  const raw = localStorage.getItem(KEYS.dailyLogs);
  return raw ? JSON.parse(raw) : [];
}

export function getTodayLog(): DailyLog {
  const today = new Date().toISOString().split('T')[0];
  const logs = getDailyLogs();
  const existing = logs.find(l => l.date === today);
  return existing || { date: today, sabbakCompleted: [], sabqiCompleted: [], manzilCompleted: [], missedDay: false };
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  const idx = logs.findIndex(l => l.date === log.date);
  if (idx >= 0) logs[idx] = log;
  else logs.push(log);
  localStorage.setItem(KEYS.dailyLogs, JSON.stringify(logs));
}

// Manzil rotation index
export function getManzilIndex(): number {
  return parseInt(localStorage.getItem(KEYS.currentManzilIndex) || '0', 10);
}

export function saveManzilIndex(idx: number): void {
  localStorage.setItem(KEYS.currentManzilIndex, String(idx));
}

// Connection Flags
export function getConnectionFlags(): ConnectionFlag[] {
  const raw = localStorage.getItem(KEYS.connectionFlags);
  return raw ? JSON.parse(raw) : [];
}

export function saveConnectionFlag(flag: ConnectionFlag): void {
  const flags = getConnectionFlags();
  const existing = flags.findIndex(f => f.fromPage === flag.fromPage);
  if (existing >= 0) flags[existing] = flag;
  else flags.push(flag);
  localStorage.setItem(KEYS.connectionFlags, JSON.stringify(flags));
}

export function removeConnectionFlag(fromPage: number): void {
  const flags = getConnectionFlags().filter(f => f.fromPage !== fromPage);
  localStorage.setItem(KEYS.connectionFlags, JSON.stringify(flags));
}

// Streak tracking
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export function getStreakData(): StreakData {
  const raw = localStorage.getItem(KEYS.streak);
  return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
}

export function updateStreak(): StreakData {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreakData();
  
  if (streak.lastActiveDate === today) return streak; // already updated today
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastActiveDate === yesterdayStr) {
    streak.currentStreak += 1;
  } else if (streak.lastActiveDate !== today) {
    streak.currentStreak = 1;
  }
  
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActiveDate = today;
  
  localStorage.setItem(KEYS.streak, JSON.stringify(streak));
  return streak;
}
