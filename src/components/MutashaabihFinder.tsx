import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookMarked, X, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { findSimilarVerses, FULL_SIMILARITIES, type SimilarVerse } from '@/lib/mutashaabihaat-database';
import type { Ayah } from '@/lib/quran-api';

interface MutashaabihFinderProps {
  currentSurah?: number;
  currentAyah?: number;
  currentPage?: number;
  selectedAyah?: Ayah | null;
}

export function MutashaabihFinder({ currentSurah, currentAyah, currentPage, selectedAyah }: MutashaabihFinderProps) {
  const [similarVerses, setSimilarVerses] = useState<SimilarVerse[]>([]);
  const [searchSurah, setSearchSurah] = useState('');
  const [searchAyah, setSearchAyah] = useState('');
  const [highlightedVerse, setHighlightedVerse] = useState<{ surah: number; ayah: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<Array<{ surah: number; ayah: number }>>([]);

  // Auto-load when selectedAyah changes
  useEffect(() => {
    if (selectedAyah) {
      const verseKeyParts = selectedAyah.verse_key?.split(':') || ['1', '1'];
      const surahNum = parseInt(verseKeyParts[0]);
      const ayahNum = parseInt(verseKeyParts[1]);
      
      if (surahNum > 0 && ayahNum > 0) {
        console.log('Loading similar verses for selected ayah:', surahNum, ayahNum);
        loadSimilarVerses(surahNum, ayahNum);
      }
    } else if (currentSurah && currentAyah) {
      // Fallback to props if no selectedAyah
      loadSimilarVerses(currentSurah, currentAyah);
    }
  }, [selectedAyah, currentSurah, currentAyah]);

  const loadSimilarVerses = (surah: number, ayah: number, addToHistory = true) => {
    const similar = findSimilarVerses(surah, ayah);
    console.log(`Found ${similar.length} similar verses for ${surah}:${ayah}:`, similar);
    setSimilarVerses(similar);
    setHighlightedVerse({ surah, ayah });
    setSearchSurah(surah.toString());
    setSearchAyah(ayah.toString());
    setHasSearched(true);
    
    if (addToHistory) {
      setHistory(prev => [...prev.slice(-4), { surah, ayah }]);
    }
  };

  const handleSearch = () => {
    const surah = parseInt(searchSurah);
    const ayah = parseInt(searchAyah);
    
    if (isNaN(surah) || isNaN(ayah) || surah < 1 || surah > 114 || ayah < 1) {
      alert('Please enter valid surah (1-114) and ayah numbers');
      return;
    }
    
    loadSimilarVerses(surah, ayah);
  };

  const handleClear = () => {
    setSimilarVerses([]);
    setSearchSurah('');
    setSearchAyah('');
    setHighlightedVerse(null);
    setHasSearched(false);
    setHistory([]);
  };

  const handleQuickJump = (surah: number, ayah: number) => {
    loadSimilarVerses(surah, ayah);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const previous = history[history.length - 2];
      loadSimilarVerses(previous.surah, previous.ayah, false);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const totalSimilarities = FULL_SIMILARITIES.reduce((acc, entry) => acc + entry.similarTo.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-muted-foreground" />
          Similar Verses (Mutashaabihaat)
        </h3>
        {history.length > 1 && (
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowRight className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
      </div>

      {/* Selected Ayah Display */}
      {selectedAyah && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">Selected Verse:</p>
          <p className="font-display text-lg text-foreground text-right leading-relaxed" dir="rtl">
            {selectedAyah.text_uthmani}
          </p>
          <p className="text-xs text-accent mt-2">
            Surah {currentSurah}, Ayah {currentAyah} (Page {currentPage})
          </p>
        </div>
      )}

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
        {hasSearched && (
          <Button onClick={handleClear} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Current verse indicator with breadcrumb */}
      {highlightedVerse && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
          <div className="flex items-center gap-1 flex-wrap">
            {history.length > 1 && (
              <>
                <span className="text-muted-foreground/60">Chain: </span>
                {history.slice(0, -1).map((h, i) => (
                  <span key={i} className="text-muted-foreground/60">
                    {h.surah}:{h.ayah} →{' '}
                  </span>
                ))}
              </>
            )}
            <span className="font-medium text-foreground">
              Surah {highlightedVerse.surah}, Ayah {highlightedVerse.ayah}
            </span>
          </div>
        </div>
      )}

      {/* Similar verses display */}
      <AnimatePresence mode="wait">
        {similarVerses.length > 0 ? (
          <motion.div
            key="results"
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
                Exact Matches
              </Badge>
            </div>
            
            <div className="space-y-2">
              {similarVerses.map((verse, idx) => (
                <motion.div
                  key={`${verse.surah}:${verse.ayah}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group border border-transparent hover:border-accent/30"
                  onClick={() => handleQuickJump(verse.surah, verse.ayah)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                        Surah {verse.surah}, Ayah {verse.ayah}
                      </span>
                      <Badge 
                        variant={verse.type === 'full' ? 'default' : 'secondary'} 
                        className="ml-2 text-xs"
                      >
                        {verse.type === 'full' ? 'Exact Match' : 'Partial'}
                      </Badge>
                    </div>
                    <Search className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  {verse.note && (
                    <p className="text-xs text-muted-foreground mt-1">{verse.note}</p>
                  )}
                  <p className="text-xs text-accent mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to see its similar verses →
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-3 border-t mt-3">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  These verses are <strong>exactly the same</strong> in Arabic text. 
                  Click any verse to explore its similarities and build a chain.
                </span>
              </p>
            </div>
          </motion.div>
        ) : hasSearched ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-muted-foreground text-sm pile-card"
          >
            <BookMarked className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No similar verses found for Surah {highlightedVerse?.surah}, Ayah {highlightedVerse?.ayah}</p>
            <p className="text-xs mt-1">This verse is unique in the Quran</p>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-muted-foreground text-sm"
          >
            <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Click any verse in the Mushaf to find similar verses</p>
            <p className="text-xs mt-1">Or manually enter Surah and Ayah numbers</p>
            <p className="text-xs mt-1 text-muted-foreground/60">
              Database contains {totalSimilarities}+ verified similarities
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="pile-card p-3 bg-primary/5 border-primary/20">
        <h4 className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          How to use Mutashaabihaat
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong>Click any verse</strong> in the Mushaf above to auto-search</li>
          <li>Or manually enter Surah and Ayah numbers</li>
          <li>Click any result to explore its similar verses</li>
          <li>Build chains of similar verses for memorization practice</li>
        </ul>
      </div>
    </div>
  );
}