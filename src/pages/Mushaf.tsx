import { useState } from "react";
import { getSettings } from "@/lib/storage";
import { getSurahForPage, getJuzForPage, TOTAL_PAGES, SURAHS } from "@/data/quran-metadata";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Mushaf() {
  const settings = getSettings();
  const [currentPage, setCurrentPage] = useState(settings?.memorizedFrom || 1);

  if (!settings?.onboardingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground">Complete onboarding first.</p>
      </div>
    );
  }

  const surah = getSurahForPage(currentPage);
  const juz = getJuzForPage(currentPage);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground">Mushaf View</h1>
        <p className="text-sm text-muted-foreground">Page-by-page navigation</p>
      </div>

      {/* Surah Navigation */}
      <div className="mb-4">
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg border bg-card text-foreground text-sm"
        >
          {SURAHS.map(s => (
            <option key={s.number} value={s.startPage}>
              {s.number}. {s.name} ({s.arabicName}) — Page {s.startPage}
            </option>
          ))}
        </select>
      </div>

      {/* Page Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pile-card min-h-[500px] flex flex-col items-center justify-center relative"
        >
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Juz {juz}</span>
            <span className="font-display text-sm text-gold">{surah.arabicName}</span>
            <span>{surah.name}</span>
          </div>

          {/* Page Content Placeholder */}
          <div className="text-center space-y-4 py-12">
            <p className="font-display text-8xl text-primary/20">{currentPage}</p>
            <p className="text-muted-foreground text-sm">Page {currentPage}</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              This is a placeholder for the Mushaf text. In a full implementation, this would display the actual Arabic text in 15-line Madinah layout.
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 text-center">
            <p className="text-xs text-muted-foreground">Page {currentPage} of {TOTAL_PAGES}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={TOTAL_PAGES}
            value={currentPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= TOTAL_PAGES) setCurrentPage(v);
            }}
            className="w-20 px-2 py-1 rounded border bg-card text-foreground text-center text-sm"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(TOTAL_PAGES, currentPage + 1))}
          disabled={currentPage >= TOTAL_PAGES}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
