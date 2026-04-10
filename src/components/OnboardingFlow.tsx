import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSettings, type UserSettings } from "@/lib/storage";
import { SURAHS, TOTAL_PAGES } from "@/data/quran-metadata";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(604);
  const [dailySabbak, setDailySabbak] = useState(1);
  const [dailyManzil, setDailyManzil] = useState(5);

  const handleComplete = () => {
    const settings: UserSettings = {
      memorizedFrom: fromPage,
      memorizedTo: toPage,
      dailySabbakPages: dailySabbak,
      sabqiDays: 7,
      dailyManzilPages: dailyManzil,
      startDate: new Date().toISOString().split('T')[0],
      onboardingComplete: true,
    };
    saveSettings(settings);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="font-display text-4xl text-primary">بِسْمِ اللَّهِ</h1>
            <h2 className="font-display text-2xl text-foreground">Welcome to Hifz Companion</h2>
            <p className="text-muted-foreground">Your personal Quran memorization & revision assistant. All data stays on your device.</p>
            <Button onClick={() => setStep(1)} className="w-full">Get Started</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-center text-foreground">What have you memorized?</h2>
            <p className="text-sm text-muted-foreground text-center">Set the page range of your memorized portion (Madinah Mushaf, 604 pages)</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">From Page</label>
                <input
                  type="number"
                  min={1}
                  max={TOTAL_PAGES}
                  value={fromPage}
                  onChange={(e) => setFromPage(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {SURAHS.find(s => s.startPage <= fromPage && (SURAHS[SURAHS.indexOf(s) + 1]?.startPage || 605) > fromPage)?.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">To Page</label>
                <input
                  type="number"
                  min={1}
                  max={TOTAL_PAGES}
                  value={toPage}
                  onChange={(e) => setToPage(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {SURAHS.find(s => s.startPage <= toPage && (SURAHS[SURAHS.indexOf(s) + 1]?.startPage || 605) > toPage)?.name}
                </p>
              </div>
            </div>
            
            <p className="text-center text-sm text-accent font-medium">{toPage - fromPage + 1} pages memorized</p>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(2)} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-center text-foreground">Daily Goals</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">New lesson (Sabbak) pages/day</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={dailySabbak}
                  onChange={(e) => setDailySabbak(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 if you've completed Hifz</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Revision (Manzil) pages/day</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={dailyManzil}
                  onChange={(e) => setDailyManzil(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">Recommended: {Math.ceil((toPage - fromPage + 1) / 30)} pages for monthly completion</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={handleComplete} className="flex-1">Start My Journey</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
