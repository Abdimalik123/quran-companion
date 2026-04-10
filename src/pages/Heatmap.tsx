import { useState } from "react";
import { getSettings, getAllPageData } from "@/lib/storage";
import { getHeatmapColor, getWeakPages } from "@/lib/scheduler";
import { getSurahForPage, getJuzForPage, TOTAL_PAGES } from "@/data/quran-metadata";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Heatmap() {
  const settings = getSettings();
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);
  const allData = getAllPageData();
  const weakPages = getWeakPages();

  if (!settings?.onboardingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground">Complete onboarding first.</p>
      </div>
    );
  }

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground">Mastery Map</h1>
        <p className="text-sm text-muted-foreground">Each cell is a page. Colors show revision freshness and confidence.</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-green" />
          <span className="text-xs text-muted-foreground">Recent & Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-lime" />
          <span className="text-xs text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-yellow" />
          <span className="text-xs text-muted-foreground">Needs Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-orange" />
          <span className="text-xs text-muted-foreground">Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-red" />
          <span className="text-xs text-muted-foreground">Weak / Stale</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-heatmap-unmemorized" />
          <span className="text-xs text-muted-foreground">Not Memorized</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="pile-card text-center py-3">
          <p className="text-xl font-bold text-primary">{settings.memorizedTo - settings.memorizedFrom + 1}</p>
          <p className="text-xs text-muted-foreground">Memorized</p>
        </div>
        <div className="pile-card text-center py-3">
          <p className="text-xl font-bold text-confidence-weak">{weakPages.length}</p>
          <p className="text-xs text-muted-foreground">Weak Pages</p>
        </div>
        <div className="pile-card text-center py-3">
          <p className="text-xl font-bold text-confidence-strong">
            {Object.values(allData).filter(d => d.confidence === 'strong').length}
          </p>
          <p className="text-xs text-muted-foreground">Strong Pages</p>
        </div>
        <div className="pile-card text-center py-3">
          <p className="text-xl font-bold text-foreground">{Object.values(allData).filter(d => d.lastRevised).length}</p>
          <p className="text-xs text-muted-foreground">Ever Revised</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="pile-card p-4">
        {/* Juz markers */}
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(18px, 1fr))' }}>
          {pages.map(page => {
            const color = getHeatmapColor(page, settings.memorizedFrom, settings.memorizedTo);
            const surah = getSurahForPage(page);
            const juz = getJuzForPage(page);
            const data = allData[page];

            return (
              <Tooltip key={page}>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    className={`aspect-square rounded-sm ${color} cursor-pointer transition-colors relative`}
                    onMouseEnter={() => setHoveredPage(page)}
                    onMouseLeave={() => setHoveredPage(null)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-medium">Page {page} • Juz {juz}</p>
                  <p>{surah.name} ({surah.arabicName})</p>
                  {data?.lastRevised && <p>Last: {data.lastRevised}</p>}
                  {data?.confidence && <p>Confidence: {data.confidence}</p>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
