import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, getTodayLog, saveDailyLog, getStreakData } from "@/lib/storage";
import { generateDailyPlan, type DailyPlan } from "@/lib/scheduler";
import { PileCard } from "@/components/PileCard";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { MissedDayDialog } from "@/components/MissedDayDialog";
import { motion } from "framer-motion";
import { CalendarDays, Flame } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const settings = getSettings();
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [todayLog, setTodayLog] = useState(getTodayLog());
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const streak = getStreakData();

  useEffect(() => {
    if (settings?.onboardingComplete) {
      setPlan(generateDailyPlan());
    }
  }, []);

  if (!settings?.onboardingComplete) {
    return <OnboardingFlow />;
  }

  if (!plan) return null;

  const totalMemorized = settings.memorizedTo - settings.memorizedFrom + 1;
  const totalCompleted = todayLog.sabbakCompleted.length + todayLog.sabqiCompleted.length + todayLog.manzilCompleted.length;
  const totalRequired = plan.totalPages;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-display text-3xl text-foreground">Hifz Companion</h1>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-gold">حفظ القرآن</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        <div className="pile-card text-center py-4">
          <p className="text-2xl font-bold text-primary">{totalMemorized}</p>
          <p className="text-xs text-muted-foreground">Pages Memorized</p>
        </div>
        <div className="pile-card text-center py-4">
          <div className="flex items-center justify-center gap-1">
            <Flame className="h-5 w-5 text-accent" />
            <p className="text-2xl font-bold text-accent">{totalCompleted}/{totalRequired}</p>
          </div>
          <p className="text-xs text-muted-foreground">Today's Progress</p>
        </div>
        <div className="pile-card text-center py-4">
          <div className="flex items-center justify-center gap-1">
            <Flame className="h-4 w-4 text-primary" />
            <p className="text-2xl font-bold text-foreground">{streak.currentStreak}</p>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
          {streak.longestStreak > 0 && (
            <p className="text-[10px] text-muted-foreground">Best: {streak.longestStreak}</p>
          )}
        </div>
      </motion.div>

      {/* Revision Piles */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-foreground">Today's Plan</h2>
        
        <PileCard
          type="sabbak"
          pages={plan.sabbak}
          completedPages={todayLog.sabbakCompleted}
          onStartSession={() => navigate('/session', { state: { type: 'sabbak', pages: plan.sabbak } })}
        />
        
        <PileCard
          type="sabqi"
          pages={plan.sabqi}
          completedPages={todayLog.sabqiCompleted}
          onStartSession={() => navigate('/session', { state: { type: 'sabqi', pages: plan.sabqi } })}
        />
        
        <PileCard
          type="manzil"
          pages={plan.manzil}
          completedPages={todayLog.manzilCompleted}
          onStartSession={() => navigate('/session', { state: { type: 'manzil', pages: plan.manzil } })}
        />
      </div>

      {/* Missed day button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowMissedDialog(true)}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Missed a day? Adjust your schedule
        </button>
      </div>

      <MissedDayDialog open={showMissedDialog} onClose={() => setShowMissedDialog(false)} />
    </div>
  );
}
