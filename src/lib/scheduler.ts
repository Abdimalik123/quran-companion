// Core scheduling engine for the 3-pile revision system
import { getSettings, getAllPageData, getTodayLog, getManzilIndex, saveManzilIndex, type ConfidenceLevel } from './storage';

export interface DailyPlan {
  sabbak: number[];   // new lesson pages
  sabqi: number[];    // recent lesson pages (last 5-7 days)
  manzil: number[];   // rotation of all memorized
  totalPages: number;
}

// Calculate how many days remain in the current month
function daysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

// Get memorized page range
function getMemorizedPages(): number[] {
  const settings = getSettings();
  if (!settings) return [];
  const pages: number[] = [];
  for (let p = settings.memorizedFrom; p <= settings.memorizedTo; p++) {
    pages.push(p);
  }
  return pages;
}

// Get pages revised in the last N days
function getRecentlyRevisedPages(days: number): Set<number> {
  const allData = getAllPageData();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  
  const recent = new Set<number>();
  for (const [page, data] of Object.entries(allData)) {
    if (data.lastRevised && data.lastRevised >= cutoffStr) {
      recent.add(Number(page));
    }
  }
  return recent;
}

// Get weak pages that need priority revision
export function getWeakPages(): number[] {
  const allData = getAllPageData();
  const pages: number[] = [];
  for (const [page, data] of Object.entries(allData)) {
    if (data.confidence === 'weak') {
      pages.push(Number(page));
    }
  }
  return pages;
}

// Monthly completion: ensure all memorized pages are cycled
export function calculateDailyManzilTarget(): number {
  const settings = getSettings();
  if (!settings) return 5;
  
  const totalMemorized = settings.memorizedTo - settings.memorizedFrom + 1;
  const remaining = daysRemainingInMonth() || 1;
  
  // Pages already revised this month
  const revisedThisMonth = getRecentlyRevisedPages(new Date().getDate()).size;
  const pagesLeft = Math.max(0, totalMemorized - revisedThisMonth);
  
  return Math.max(settings.dailyManzilPages, Math.ceil(pagesLeft / remaining));
}

// Generate today's plan
export function generateDailyPlan(): DailyPlan {
  const settings = getSettings();
  if (!settings) {
    return { sabbak: [], sabqi: [], manzil: [], totalPages: 0 };
  }
  
  const allPages = getMemorizedPages();
  if (allPages.length === 0) {
    return { sabbak: [], sabqi: [], manzil: [], totalPages: 0 };
  }
  
  const todayLog = getTodayLog();
  const allData = getAllPageData();
  
  // Sabbak: the newest pages being actively memorized (top of range)
  const sabbak: number[] = [];
  for (let i = 0; i < settings.dailySabbakPages && i < allPages.length; i++) {
    sabbak.push(allPages[allPages.length - 1 - i]);
  }
  
  // Sabqi: pages from the last sabqiDays that are not in sabbak
  const recentPages = getRecentlyRevisedPages(settings.sabqiDays);
  const sabbakSet = new Set(sabbak);
  const sabqi = allPages.filter(p => recentPages.has(p) && !sabbakSet.has(p)).slice(0, 10);
  
  // Manzil: rotating through remaining memorized pages
  const manzilTarget = calculateDailyManzilTarget();
  const excludeSet = new Set([...sabbak, ...sabqi]);
  const manzilPool = allPages.filter(p => !excludeSet.has(p));
  
  // Prioritize weak pages
  const weakPages = manzilPool.filter(p => allData[p]?.confidence === 'weak');
  const normalPages = manzilPool.filter(p => allData[p]?.confidence !== 'weak');
  
  // Rotate through manzil using stored index
  let manzilIdx = getManzilIndex();
  const manzil: number[] = [];
  
  // Add weak pages first
  for (const wp of weakPages) {
    if (manzil.length >= manzilTarget) break;
    manzil.push(wp);
  }
  
  // Fill rest from rotation
  if (normalPages.length > 0) {
    while (manzil.length < manzilTarget) {
      const idx = manzilIdx % normalPages.length;
      if (!manzil.includes(normalPages[idx])) {
        manzil.push(normalPages[idx]);
      }
      manzilIdx++;
      if (manzilIdx - getManzilIndex() > normalPages.length) break;
    }
    saveManzilIndex(manzilIdx);
  }
  
  return {
    sabbak,
    sabqi,
    manzil,
    totalPages: sabbak.length + sabqi.length + manzil.length,
  };
}

// Catch-up: recalculate when days are missed
export function calculateCatchUpPlan(missedDays: number): { extraPagesPerDay: number; adjustedManzil: number } {
  const settings = getSettings();
  if (!settings) return { extraPagesPerDay: 0, adjustedManzil: 5 };
  
  const totalMemorized = settings.memorizedTo - settings.memorizedFrom + 1;
  const remaining = daysRemainingInMonth() || 1;
  const missedPages = missedDays * settings.dailyManzilPages;
  
  return {
    extraPagesPerDay: Math.ceil(missedPages / remaining),
    adjustedManzil: Math.ceil(totalMemorized / remaining),
  };
}

// Get confidence color class
export function getConfidenceColor(confidence: ConfidenceLevel | null): string {
  switch (confidence) {
    case 'weak': return 'confidence-weak';
    case 'medium': return 'confidence-medium';
    case 'strong': return 'confidence-strong';
    default: return 'heatmap-unmemorized';
  }
}

// Get heatmap color based on revision data
export function getHeatmapColor(page: number, memorizedFrom: number, memorizedTo: number): string {
  if (page < memorizedFrom || page > memorizedTo) return 'bg-heatmap-unmemorized';
  
  const allData = getAllPageData();
  const data = allData[page];
  
  if (!data || !data.lastRevised) return 'bg-heatmap-red';
  
  const daysSince = Math.floor((Date.now() - new Date(data.lastRevised).getTime()) / (1000 * 60 * 60 * 24));
  
  if (data.confidence === 'weak') return 'bg-heatmap-red';
  if (daysSince > 25) return 'bg-heatmap-red';
  if (daysSince > 18) return 'bg-heatmap-orange';
  if (daysSince > 12) return 'bg-heatmap-yellow';
  if (daysSince > 5) return 'bg-heatmap-lime';
  return 'bg-heatmap-green';
}
