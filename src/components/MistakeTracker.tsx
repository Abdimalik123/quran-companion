import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addMistake, getMistakesForPage, deleteMistake, clearMistakesForPage, type MistakeType, type PageMistake } from '@/lib/storage-enhanced';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface MistakeTrackerProps {
  page: number;
  ayahNumber?: number;
  wordIndex?: number;
  onMistakeAdded?: () => void;
}

export function MistakeTracker({ page, ayahNumber, wordIndex, onMistakeAdded }: MistakeTrackerProps) {
  const [mistakes, setMistakes] = useState<PageMistake[]>(getMistakesForPage(page));
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<MistakeType>('saktah');
  const [notes, setNotes] = useState('');

  const handleAddMistake = () => {
    const mistake: PageMistake = {
      page,
      ayahNumber,
      wordIndex,
      type: selectedType,
      timestamp: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };
    
    addMistake(mistake);
    setMistakes(getMistakesForPage(page));
    setShowAddDialog(false);
    setNotes('');
    onMistakeAdded?.();
  };

  const handleDeleteMistake = (timestamp: string) => {
    deleteMistake(timestamp);
    setMistakes(getMistakesForPage(page));
  };

  const handleClearAll = () => {
    if (confirm('Clear all mistakes for this page?')) {
      clearMistakesForPage(page);
      setMistakes([]);
    }
  };

  const mistakeLabels: Record<MistakeType, { label: string; emoji: string; color: string }> = {
    saktah: { label: 'Saktah (Pause)', emoji: '⏸️', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30' },
    lahm: { label: 'Lahm (Melody)', emoji: '🎵', color: 'bg-blue-500/10 text-blue-700 border-blue-500/30' },
    other: { label: 'Other', emoji: '⚠️', color: 'bg-red-500/10 text-red-700 border-red-500/30' },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          Mistakes Tracker
        </h3>
        <div className="flex items-center gap-2">
          {mistakes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">Mark Mistake</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Mistake</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Mistake Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(mistakeLabels) as MistakeType[]).map(type => {
                      const config = mistakeLabels[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            selectedType === type
                              ? config.color + ' ring-2'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="text-2xl mb-1">{config.emoji}</div>
                          <div className="text-xs font-medium">{config.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {ayahNumber && (
                  <p className="text-sm text-muted-foreground">
                    Location: Page {page}, Ayah {ayahNumber}
                    {wordIndex !== undefined && `, Word ${wordIndex}`}
                  </p>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Notes (Optional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this mistake..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleAddMistake} className="w-full">
                  Add Mistake
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mistakes list */}
      <AnimatePresence>
        {mistakes.length > 0 ? (
          <div className="space-y-2">
            {mistakes.map((mistake) => {
              const config = mistakeLabels[mistake.type];
              return (
                <motion.div
                  key={mistake.timestamp}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 rounded-lg border ${config.color} flex items-start justify-between`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{config.emoji}</span>
                      <span className="text-sm font-medium">{config.label}</span>
                      {mistake.ayahNumber && (
                        <Badge variant="outline" className="text-xs">
                          Ayah {mistake.ayahNumber}
                        </Badge>
                      )}
                    </div>
                    {mistake.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{mistake.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(mistake.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMistake(mistake.timestamp)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No mistakes tracked yet
          </div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {mistakes.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Total: {mistakes.length}</span>
          {Object.keys(mistakeLabels).map(type => {
            const count = mistakes.filter(m => m.type === type).length;
            if (count === 0) return null;
            return (
              <span key={type}>
                {mistakeLabels[type as MistakeType].emoji} {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
