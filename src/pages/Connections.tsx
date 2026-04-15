import { useState } from "react";
import { getSettings, getConnectionFlags, saveConnectionFlag, removeConnectionFlag, type ConnectionFlag } from "@/lib/storage";
import { getSurahForPage, TOTAL_PAGES } from "@/data/quran-metadata";
import { Button } from "@/components/ui/button";
import { Link2, Plus, Trash2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Connections() {
  const settings = getSettings();
  const [flags, setFlags] = useState(getConnectionFlags());
  const [showAdd, setShowAdd] = useState(false);
  const [newPage, setNewPage] = useState(1);
  const [newNotes, setNewNotes] = useState("");

  if (!settings?.onboardingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground">Complete onboarding first.</p>
      </div>
    );
  }

  const handleAdd = () => {
    const flag: ConnectionFlag = {
      fromPage: newPage,
      toPage: newPage + 1,
      notes: newNotes,
      createdAt: new Date().toISOString(),
    };
    saveConnectionFlag(flag);
    setFlags(getConnectionFlags());
    setShowAdd(false);
    setNewPage(1);
    setNewNotes("");
  };

  const handleRemove = (fromPage: number) => {
    removeConnectionFlag(fromPage);
    setFlags(getConnectionFlags());
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-foreground">Connection Flags</h1>
          <p className="text-sm text-muted-foreground">Bookmark page transitions to practice smooth continuity</p>
        </div>
        <Button onClick={() => setShowAdd(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {flags.length === 0 ? (
        <div className="pile-card text-center py-12 space-y-3">
          <Link2 className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <h3 className="font-display text-lg text-foreground">No connections flagged yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Flag the transition between two pages where you struggle to connect the ending of one page to the beginning of the next.
          </p>
          <Button onClick={() => setShowAdd(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Flag a connection
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {flags.map((flag) => {
              const fromSurah = getSurahForPage(flag.fromPage);
              const toSurah = getSurahForPage(flag.toPage);
              return (
                <motion.div
                  key={flag.fromPage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="pile-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Link2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-display text-base text-foreground">
                          Page {flag.fromPage} → {flag.toPage}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {fromSurah.name} ({fromSurah.arabicName}) → {toSurah.name} ({toSurah.arabicName})
                        </p>
                        {flag.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">"{flag.notes}"</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(flag.fromPage)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Flag a Connection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">End of page (transition FROM)</label>
              <input
                type="number"
                min={settings.memorizedFrom}
                max={Math.min(settings.memorizedTo - 1, TOTAL_PAGES - 1)}
                value={newPage}
                onChange={(e) => setNewPage(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Connection: Page {newPage} → Page {newPage + 1}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Notes (optional)</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g., Similar ending words, tricky transition..."
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground text-sm resize-none"
                rows={2}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">
              <BookOpen className="h-4 w-4 mr-1" /> Flag Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
