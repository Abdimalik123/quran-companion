import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { savePageData, getTodayLog, saveDailyLog, type ConfidenceLevel } from "@/lib/storage";
import { ConfidenceSlider } from "@/components/ConfidenceSlider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { type: string; pages: number[] } | null;

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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rated, setRated] = useState<Record<number, ConfidenceLevel>>({});
  const currentPage = pages[currentIdx];

  const handleRate = (page: number, confidence: ConfidenceLevel) => {
    setRated(prev => ({ ...prev, [page]: confidence }));
  };

  const handleComplete = () => {
    // Save all ratings and mark completed
    const today = new Date().toISOString().split('T')[0];
    const todayLog = getTodayLog();

    for (const page of pages) {
      const confidence = rated[page] || 'medium';
      savePageData(page, {
        lastRevised: today,
        confidence,
        revisionCount: 1, // Will increment properly with existing data
      });
    }

    // Update daily log
    const key = type === 'sabbak' ? 'sabbakCompleted' : type === 'sabqi' ? 'sabqiCompleted' : 'manzilCompleted';
    saveDailyLog({
      ...todayLog,
      [key]: [...new Set([...(todayLog as any)[key], ...pages])],
    });

    navigate('/');
  };

  const pileLabels: Record<string, string> = {
    sabbak: 'Sabbak — New Lesson',
    sabqi: 'Sabqi — Recent Review',
    manzil: 'Manzil — Full Revision',
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="text-sm font-medium text-primary">{pileLabels[type] || 'Session'}</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Page {currentIdx + 1} of {pages.length}</span>
          <span className="text-sm text-muted-foreground">{Object.keys(rated).length} rated</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Page */}
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

          <ConfidenceSlider
            page={currentPage}
            onRate={handleRate}
            currentConfidence={rated[currentPage]}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {currentIdx === pages.length - 1 ? (
          <Button onClick={handleComplete} className="flex-1">
            <Check className="h-4 w-4 mr-1" /> Complete Session
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
