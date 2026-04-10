import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calculateCatchUpPlan } from "@/lib/scheduler";
import { getSettings, saveSettings } from "@/lib/storage";

interface MissedDayDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MissedDayDialog({ open, onClose }: MissedDayDialogProps) {
  const [missedDays, setMissedDays] = useState(1);
  const catchUp = calculateCatchUpPlan(missedDays);

  const handleCatchUp = () => {
    // Increase daily load temporarily
    const settings = getSettings();
    if (settings) {
      saveSettings({
        ...settings,
        dailyManzilPages: settings.dailyManzilPages + catchUp.extraPagesPerDay,
      });
    }
    onClose();
    window.location.reload();
  };

  const handleAdjust = () => {
    // Recalculate for remaining month
    const settings = getSettings();
    if (settings) {
      saveSettings({
        ...settings,
        dailyManzilPages: catchUp.adjustedManzil,
      });
    }
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Missed Days</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">How many days did you miss?</label>
            <input
              type="number"
              min={1}
              max={15}
              value={missedDays}
              onChange={(e) => setMissedDays(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="pile-card text-center">
              <h4 className="font-display text-sm text-foreground mb-1">Catch Up</h4>
              <p className="text-2xl font-bold text-accent">+{catchUp.extraPagesPerDay}</p>
              <p className="text-xs text-muted-foreground">extra pages/day</p>
              <Button onClick={handleCatchUp} size="sm" className="mt-3 w-full">Catch Up</Button>
            </div>
            
            <div className="pile-card text-center">
              <h4 className="font-display text-sm text-foreground mb-1">Adjust</h4>
              <p className="text-2xl font-bold text-primary">{catchUp.adjustedManzil}</p>
              <p className="text-xs text-muted-foreground">pages/day remaining</p>
              <Button onClick={handleAdjust} variant="outline" size="sm" className="mt-3 w-full">Adjust</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
