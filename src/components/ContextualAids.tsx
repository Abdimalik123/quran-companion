import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Languages, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAyahTafsir, getAyahWords, getAyahTranslation } from '@/lib/quran-api';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ContextualAidsProps {
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
}

export function ContextualAids({ surahNumber, ayahNumber, ayahText }: ContextualAidsProps) {
  const [showTafsir, setShowTafsir] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [tafsir, setTafsir] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTafsir = async () => {
    if (!showTafsir && !tafsir) {
      setLoading(true);
      try {
        const data = await getAyahTafsir(surahNumber, ayahNumber);
        setTafsir(data);
      } catch (error) {
        console.error('Error loading tafsir:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowTafsir(!showTafsir);
  };

  const loadTranslation = async () => {
    if (!showTranslation && !translation) {
      setLoading(true);
      try {
        const data = await getAyahTranslation(surahNumber, ayahNumber);
        setTranslation(data);
      } catch (error) {
        console.error('Error loading translation:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowTranslation(!showTranslation);
  };

  const loadWords = async () => {
    if (!showWords && words.length === 0) {
      setLoading(true);
      try {
        const data = await getAyahWords(surahNumber, ayahNumber);
        setWords(data);
      } catch (error) {
        console.error('Error loading words:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowWords(!showWords);
  };

  return (
    <div className="space-y-2 border-l-2 border-primary/20 pl-3">
      {/* Ayah reference */}
      <div className="text-xs text-muted-foreground mb-2">
        Surah {surahNumber}, Ayah {ayahNumber}
      </div>

      {/* Translation Toggle */}
      <Collapsible open={showTranslation} onOpenChange={setShowTranslation}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadTranslation}
            className="w-full justify-between text-xs"
          >
            <span className="flex items-center gap-2">
              <Languages className="h-3 w-3" />
              Translation
            </span>
            {showTranslation ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {showTranslation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 rounded-lg bg-muted text-sm"
              >
                {loading ? (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                ) : translation ? (
                  <p className="text-foreground leading-relaxed">{translation}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Translation unavailable</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Tafsir Toggle */}
      <Collapsible open={showTafsir} onOpenChange={setShowTafsir}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadTafsir}
            className="w-full justify-between text-xs"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              Brief Tafsir
            </span>
            {showTafsir ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {showTafsir && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 rounded-lg bg-accent/5 text-sm"
              >
                {loading ? (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                ) : tafsir ? (
                  <div 
                    className="text-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: tafsir }}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Tafsir unavailable</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Word-by-Word Toggle */}
      <Collapsible open={showWords} onOpenChange={setShowWords}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWords}
            className="w-full justify-between text-xs"
          >
            <span className="flex items-center gap-2">
              <Languages className="h-3 w-3" />
              Word Meanings
            </span>
            {showWords ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {showWords && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {loading ? (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                ) : words.length > 0 ? (
                  <div className="grid gap-2">
                    {words.map((word, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-muted/50 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display text-lg text-foreground">
                            {word.text_uthmani || word.text}
                          </span>
                          <span className="text-muted-foreground flex-1 text-right">
                            {word.translation?.text || word.translation || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Word meanings unavailable</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
