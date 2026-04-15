import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import type { ConfidenceLevel } from "@/lib/storage";

interface SessionSummaryProps {
  type: string;
  pages: number[];
  flagged: Record<number, ConfidenceLevel>;
  setFlagged: React.Dispatch<React.SetStateAction<Record<number, ConfidenceLevel>>>;
  onBack: () => void;
  onComplete: () => void;
  pileLabels: Record<string, string>;
}

export function SessionSummary({ type, pages, flagged, setFlagged, onBack, onComplete, pileLabels }: SessionSummaryProps) {
  const flaggedCount = Object.keys(flagged).length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Review
        </Button>
        <span className="text-sm font-medium text-primary">{pileLabels[type] || 'Session'}</span>
      </div>

      <div className="pile-card text-center space-y-4 py-8 mb-6">
        <h2 className="font-display text-2xl text-foreground">Session Summary</h2>
        <p className="text-muted-foreground text-sm">
          {pages.length} pages reviewed • {pages.length - flaggedCount} strong • {flaggedCount} flagged
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <span className="flex items-center gap-1.5">🟢 <span className="text-muted-foreground">{pages.length - flaggedCount} Strong</span></span>
          <span className="flex items-center gap-1.5">🟡 <span className="text-muted-foreground">{Object.values(flagged).filter(v => v === 'medium').length} Medium</span></span>
          <span className="flex items-center gap-1.5">🔴 <span className="text-muted-foreground">{Object.values(flagged).filter(v => v === 'weak').length} Weak</span></span>
        </div>
      </div>

      {flaggedCount > 0 && (
        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Flagged Pages</h3>
          <div className="flex flex-wrap gap-2">
            {pages.filter(p => flagged[p]).map(p => (
              <button
                key={p}
                onClick={() => {
                  setFlagged(prev => {
                    const current = prev[p];
                    if (current === 'medium') return { ...prev, [p]: 'weak' };
                    if (current === 'weak') {
                      const { [p]: _, ...rest } = prev;
                      return rest;
                    }
                    return prev;
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  flagged[p] === 'weak'
                    ? 'border-red-500 bg-red-500/10 text-red-600'
                    : 'border-yellow-500 bg-yellow-500/10 text-yellow-600'
                }`}
              >
                Page {p} {flagged[p] === 'weak' ? '🔴' : '🟡'}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Tap to cycle: Medium → Weak → Remove</p>
        </div>
      )}

      <Button onClick={onComplete} className="w-full" size="lg">
        <Check className="h-4 w-4 mr-1" /> Complete Session
      </Button>
    </div>
  );
}
