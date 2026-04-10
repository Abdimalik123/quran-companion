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
  sabqiDays: number;         // how many days back for Sabqi (default 7)
  dailyManzilPages: number;  // manzil/revision pages per day
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

const KEYS = {
  settings: 'hifz-settings',
  pageData: 'hifz-page-data',
  dailyLogs: 'hifz-daily-logs',
  currentManzilIndex: 'hifz-manzil-index',
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
  all[page] = { ...getPageData(page), ...data, page };
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
