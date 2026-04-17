import { useState, useEffect } from "react";
import { getSettings } from "@/lib/storage";
import { getSurahForPage, getJuzForPage, TOTAL_PAGES, SURAHS } from "@/data/quran-metadata";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, AlertCircle, Link2, BookOpen, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPageAyahs, getPageAyahRange, type Ayah } from "@/lib/quran-api";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MistakeTracker } from "@/components/MistakeTracker";
import { ConnectionFlags } from "@/components/ConnectionFlags";
import { MutashaabihFinder } from "@/components/MutashaabihFinder";
import { cn } from "@/lib/utils";

export default function Mushaf() {
  const settings = getSettings();

  const [currentPage, setCurrentPage] = useState(settings?.memorizedFrom || 1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAudio, setShowAudio] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showMutashaabih, setShowMutashaabih] = useState(false);

  // Track selected verse for Mutashaabih
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [currentSurah, setCurrentSurah] = useState<number | undefined>(undefined);
  const [currentAyah, setCurrentAyah] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadPageData();
  }, [currentPage]);

  const loadPageData = async () => {
    setLoading(true);
    setSelectedAyah(null); // Clear selection when page changes
    try {
      const pageAyahs = await getPageAyahs(currentPage);
      console.log("RAW AYAH DATA:", pageAyahs);
      setAyahs(pageAyahs || []);
      
      // Set default to first ayah on page
      if (pageAyahs && pageAyahs.length > 0) {
        const firstAyah = pageAyahs[0];
        const verseKeyParts = firstAyah.verse_key?.split(':') || ['1', '1'];
        const surahNum = parseInt(verseKeyParts[0]);
        const ayahNum = parseInt(verseKeyParts[1]);
        setCurrentSurah(surahNum);
        setCurrentAyah(ayahNum);
      }
    } catch (error) {
      console.error("Error loading page:", error);
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAyahClick = (ayah: Ayah) => {
    const verseKeyParts = ayah.verse_key?.split(':') || ['1', '1'];
    const surahNum = parseInt(verseKeyParts[0]);
    const ayahNum = parseInt(verseKeyParts[1]);
    
    setSelectedAyah(ayah);
    setCurrentSurah(surahNum);
    setCurrentAyah(ayahNum);
    setShowMutashaabih(true); // Auto-open the finder when a verse is clicked
    
    console.log('Selected verse:', surahNum, ayahNum);
  };

  if (!settings?.onboardingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground">Complete onboarding first.</p>
      </div>
    );
  }

  const surah = getSurahForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const ayahRange = getPageAyahRange(ayahs);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground">Mushaf View</h1>
        <p className="text-sm text-muted-foreground">
          Click any verse to find similar verses (Mutashaabihaat)
        </p>
      </div>

      {/* Surah Navigation */}
      <div className="mb-4">
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg border bg-card text-foreground text-sm"
        >
          {SURAHS.map((s) => (
            <option key={s.number} value={s.startPage}>
              {s.number}. {s.name} ({s.arabicName}) — Page {s.startPage}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button
          variant={showAudio ? "default" : "outline"}
          size="sm"
          onClick={() => setShowAudio(!showAudio)}
        >
          <Volume2 className="h-4 w-4 mr-1" />
          Audio
        </Button>

        <Button
          variant={showMistakes ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMistakes(!showMistakes)}
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          Mistakes
        </Button>

        <Button
          variant={showConnections ? "default" : "outline"}
          size="sm"
          onClick={() => setShowConnections(!showConnections)}
        >
          <Link2 className="h-4 w-4 mr-1" />
          Connections
        </Button>

        <Button
          variant={showMutashaabih ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMutashaabih(!showMutashaabih)}
          className={cn(selectedAyah && "border-accent text-accent")}
        >
          <Search className="h-4 w-4 mr-1" />
          Similar Verses
          {selectedAyah && <span className="ml-1 text-xs">({selectedAyah.verse_key})</span>}
        </Button>
      </div>

      {/* Audio Player */}
      {showAudio && ayahRange && (
        <div className="mb-4">
          <AudioPlayer
            page={currentPage}
            surahNumber={ayahRange.startSurah}
            ayahStart={ayahRange.startAyah}
            ayahEnd={ayahRange.endAyah}
          />
        </div>
      )}

      {/* Mistake Tracker */}
      {showMistakes && (
        <div className="mb-4 pile-card p-4">
          <MistakeTracker page={currentPage} />
        </div>
      )}

      {/* Connection Flags */}
      {showConnections && (
        <div className="mb-4 pile-card p-4">
          <ConnectionFlags currentPage={currentPage} />
        </div>
      )}

      {/* Mutashaabih Finder */}
      {showMutashaabih && (
        <div className="mb-4 pile-card p-4">
          <MutashaabihFinder 
            currentSurah={currentSurah} 
            currentAyah={currentAyah}
            currentPage={currentPage}
            selectedAyah={selectedAyah}
          />
        </div>
      )}

      {/* Page Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pile-card min-h-[500px] relative"
        >
          {/* Header */}
          <div className="border-b pb-3 mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Juz {juz}</span>
            <span className="font-display text-sm text-gold">{surah.arabicName}</span>
            <span>{surah.name}</span>
          </div>

          {/* Selection Hint */}
          {showMutashaabih && !selectedAyah && (
            <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
              <p className="text-sm text-accent font-medium">
                👆 Click any verse below to find similar verses
              </p>
            </div>
          )}

          {/* Quran Text */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading page...</p>
            </div>
          ) : ayahs.length > 0 ? (
            <div className="space-y-4" dir="rtl">
              {ayahs.map((ayah, index) => {
                const isSelected = selectedAyah?.verse_key === ayah.verse_key;
                
                return (
                  <motion.div
                    key={ayah.verse_key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className={cn(
                      "mb-6 flex flex-col items-center text-center px-2 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                      isSelected 
                        ? "bg-accent/10 border-2 border-accent shadow-md" 
                        : "hover:bg-muted/50 border-2 border-transparent"
                    )}
                    onClick={() => handleAyahClick(ayah)}
                  >
                    {/* Verse text container */}
                    <div className="max-w-2xl leading-[2.8rem] text-[1.8rem] md:text-[2.2rem] font-display text-foreground tracking-wide">
                      {ayah.text_uthmani}
                    </div>

                    {/* Verse number and selection indicator */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium border transition-all",
                        isSelected
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-gold/20 text-gold border-gold/30 group-hover:bg-gold/30"
                      )}>
                        {ayah.verse_number}
                      </span>
                      
                      {/* Selection badge */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium"
                          >
                            Selected
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Hover hint */}
                    {!isSelected && showMutashaabih && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Click to find similar verses
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">
                No content available for this page
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                API may be unavailable. Please check your connection.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-4 left-4 right-4 text-center border-t pt-3 mt-6">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {TOTAL_PAGES}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

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

        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          disabled={currentPage >= TOTAL_PAGES}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}