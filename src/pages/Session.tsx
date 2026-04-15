import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { savePageData, getPageData, getTodayLog, saveDailyLog, updateStreak, type ConfidenceLevel } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react";
import { SessionSummary } from "@/components/SessionSummary";

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { type: string; pages: number[] } | null;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'review' | 'summary'>('review');
  const [flagged, setFlagged] = useState<Record<number, ConfidenceLevel>>({});

  if (!state || !state.pages.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl text-foreground">No session selected</h2>
          <p className="text-muted-foreground">Go to the dashboard and pick a pile to start.</p>
          <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { type, pages } = state;
  const currentPage = pages[currentIdx];

  const handleFlag = () => {
    setFlagged(prev => {
      const current = prev[currentPage];
      if (!current) return { ...prev, [currentPage]: 'medium' };
      if (current === 'medium') return { ...prev, [currentPage]: 'weak' };
      const { [currentPage]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = getTodayLog();

    for (const page of pages) {
      const confidence: ConfidenceLevel = flagged[page] || 'strong';
      const existing = getPageData(page);
      savePageData(page, {
        lastRevised: today,
        confidence,
        revisionCount: existing.revisionCount + 1,
      });
    }

    const key = type === 'sabbak' ? 'sabbakCompleted' : type === 'sabqi' ? 'sabqiCompleted' : 'manzilCompleted';
    saveDailyLog({
      ...todayLog,
      [key]: [...new Set([...(todayLog as any)[key], ...pages])],
    });

    updateStreak();
    navigate('/');
  };

  const pileLabels: Record<string, string> = {
    sabbak: 'New — New Lesson',
    sabqi: 'Recent — Recent Review',
    manzil: 'Old — Full Revision',
  };

  const currentFlagged = flagged[currentPage];

  if (phase === 'summary') {
    return (
      <SessionSummary
        type={type}
        pages={pages}
        flagged={flagged}
        setFlagged={setFlagged}
        onBack={() => setPhase('review')}
        onComplete={handleComplete}
        pileLabels={pileLabels}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="text-sm font-medium text-primary">{pileLabels[type] || 'Session'}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Page {currentIdx + 1} of {pages.length}</span>
          {Object.keys(flagged).length > 0 && (
            <span className="text-sm text-accent">{Object.keys(flagged).length} flagged</span>
          )}
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="pile-card text-center space-y-6 py-12"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-2">Recite & Review</p>
            <h2 className="font-display text-6xl text-primary">{currentPage}</h2>
            <p className="text-lg text-muted-foreground mt-2">Page {currentPage}</p>
          </div>

          <button
            onClick={handleFlag}
            className={`mx-auto flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all duration-200 ${
              currentFlagged === 'weak'
                ? 'border-red-500 bg-red-500/10 text-red-600 ring-2 ring-red-500/30'
                : currentFlagged === 'medium'
                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 ring-2 ring-yellow-500/30'
                : 'border-border bg-card hover:border-muted-foreground/30 text-muted-foreground'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {currentFlagged === 'weak' ? 'Weak — tap to unflag' : currentFlagged === 'medium' ? 'Shaky — tap for Weak' : 'Flag if struggled'}
            </span>
          </button>
          <p className="text-xs text-muted-foreground">Pages default to Strong ✅ — only flag what needs work</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-6 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {currentIdx === pages.length - 1 ? (
          <Button onClick={() => setPhase('summary')} className="flex-1">
            <Check className="h-4 w-4 mr-1" /> Finish Review
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="flex-1"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
