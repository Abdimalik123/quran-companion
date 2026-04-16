import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookMarked, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { findSimilarVerses, getVerseReference, FULL_SIMILARITIES, type SimilarVerse } from '@/lib/mutashaabihaat-database';
import { getSurahForPage } from '@/data/quran-metadata';

interface MutashaabihFinderProps {
  currentSurah?: number;
  currentAyah?: number;
  currentPage?: number;
}

export function MutashaabihFinder({ currentSurah, currentAyah, currentPage }: MutashaabihFinderProps) {
  const [similarVerses, setSimilarVerses] = useState<SimilarVerse[]>([]);
  const [searchSurah, setSearchSurah] = useState('');
  const [searchAyah, setSearchAyah] = useState('');
  const [highlightedVerse, setHighlightedVerse] = useState<{ surah: number; ayah: number } | null>(null);

  useEffect(() => {
    if (currentSurah && currentAyah) {
      const similar = findSimilarVerses(currentSurah, currentAyah);
      setSimilarVerses(similar);
      setHighlightedVerse({ surah: currentSurah, ayah: currentAyah });
    }
  }, [currentSurah, currentAyah]);

  const handleSearch = () => {
    const surah = parseInt(searchSurah);
    const ayah = parseInt(searchAyah);
    
    if (isNaN(surah) || isNaN(ayah) || surah < 1 || surah > 114 || ayah < 1) {
      alert('Please enter valid surah (1-114) and ayah numbers');
      return;
    }
    
    const similar = findSimilarVerses(surah, ayah);
    setSimilarVerses(similar);
    setHighlightedVerse({ surah, ayah });
  };

  const handleClear = () => {
    setSimilarVerses([]);
    setSearchSurah('');
    setSearchAyah('');
    setHighlightedVerse(null);
  };

  const handleQuickJump = (surah: number, ayah: number) => {
    const similar = findSimilarVerses(surah, ayah);
    setSimilarVerses(similar);
    setHighlightedVerse({ surah, ayah });
    setSearchSurah(surah.toString());
    setSearchAyah(ayah.toString());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-muted-foreground" />
          Similar Verses (Mutashaabihaat)
        </h3>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex gap-1 flex-1">
          <Input
            placeholder="Surah"
            type="number"
            min={1}
            max={114}
            value={searchSurah}
            onChange={(e) => setSearchSurah(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-20"
          />
          <Input
            placeholder="Ayah"
            type="number"
            min={1}
            value={searchAyah}
            onChange={(e) => setSearchAyah(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
        </div>
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
        {similarVerses.length > 0 && (
          <Button onClick={handleClear} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Current verse indicator */}
      {highlightedVerse && (
        <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded-lg">
          Showing similarities for: <span className="font-medium text-foreground">
            Surah {highlightedVerse.surah}, Ayah {highlightedVerse.ayah}
          </span>
        </div>
      )}

      {/* Similar verses display */}
      <AnimatePresence>
        {similarVerses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pile-card p-4 space-y-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">
                Found {similarVerses.length} Similar Verse{similarVerses.length > 1 ? 's' : ''}
              </h4>
              <Badge variant="outline" className="text-xs">
                Full Matches
              </Badge>
            </div>
            
            <div className="space-y-2">
              {similarVerses.map((verse, idx) => {
                const surahInfo = getSurahForPage(1); // Placeholder, would need actual lookup
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleQuickJump(verse.surah, verse.ayah)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-foreground">
                          Surah {verse.surah}, Ayah {verse.ayah}
                        </span>
                        <Badge 
                          variant={verse.type === 'full' ? 'default' : 'secondary'} 
                          className="ml-2 text-xs"
                        >
                          {verse.type === 'full' ? 'Exact Match' : 'Partial'}
                        </Badge>
                      </div>
                      <Search className="h-3 w-3 text-muted-foreground" />
                    </div>
                    {verse.note && (
                      <p className="text-xs text-muted-foreground mt-1">{verse.note}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-3 border-t mt-3">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  These verses are <strong>exactly the same</strong> in Arabic text. 
                  Click any verse to see its similar verses.
                </span>
              </p>
            </div>
          </motion.div>
        ) : highlightedVerse ? (
          <div className="text-center py-8 text-muted-foreground text-sm pile-card">
            <BookMarked className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No similar verses found for Surah {highlightedVerse.surah}, Ayah {highlightedVerse.ayah}</p>
            <p className="text-xs mt-1">This verse is unique in the Quran</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Enter a surah and ayah number to find similar verses</p>
            <p className="text-xs mt-1">Database contains {FULL_SIMILARITIES.length}+ verified similarities</p>
          </div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="pile-card p-3 bg-primary/5 border-primary/20">
        <h4 className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          About Mutashaabihaat
        </h4>
        <p className="text-xs text-muted-foreground">
          Mutashaabihaat are verses that are identical or very similar in wording. 
          This tool helps you identify and practice these verses to avoid confusion during recitation.
        </p>
      </div>
    </div>
  );
}
