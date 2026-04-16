import { useState } from "react";
import { getSettings, saveSettings, type UserSettings } from "@/lib/storage";
import { getMushafLayout, setMushafLayout, type MushafLayout } from "@/lib/storage-enhanced";
import { TOTAL_PAGES } from "@/data/quran-metadata";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsPage() {
  const existingSettings = getSettings();
  const existingLayout = getMushafLayout();
  const [settings, setSettings] = useState<UserSettings>(existingSettings || {
    memorizedFrom: 1,
    memorizedTo: 604,
    dailySabbakPages: 1,
    sabqiDays: 7,
    dailyManzilPages: 5,
    startDate: new Date().toISOString().split('T')[0],
    onboardingComplete: false,
  });
  const [layout, setLayout] = useState<MushafLayout>(existingLayout);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings({ ...settings, onboardingComplete: true });
    setMushafLayout(layout);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('This will clear ALL your data. Are you sure?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleLayoutChange = (type: '13-line' | '15-line') => {
    setLayout({
      type,
      totalPages: type === '13-line' ? 520 : 604,
    });
  };

  const totalMemorized = settings.memorizedTo - settings.memorizedFrom + 1;
  const recommendedManzil = Math.ceil(totalMemorized / 30);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-foreground mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Customize your Hifz journey</p>
      </motion.div>

      <div className="space-y-6">
        {/* Mushaf Layout */}
        <div className="pile-card space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg text-foreground">Mushaf Layout</h3>
          </div>
          <RadioGroup 
            value={layout.type} 
            onValueChange={(value) => handleLayoutChange(value as '13-line' | '15-line')}
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/5 transition-colors">
              <RadioGroupItem value="15-line" id="15-line" />
              <Label htmlFor="15-line" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">15-Line (Madinah Mushaf)</p>
                  <p className="text-xs text-muted-foreground">604 pages - Most common</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/5 transition-colors">
              <RadioGroupItem value="13-line" id="13-line" />
              <Label htmlFor="13-line" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">13-Line (Indo-Pak)</p>
                  <p className="text-xs text-muted-foreground">520 pages</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Current: {layout.totalPages} pages ({layout.type})
          </p>
        </div>

        {/* Memorized Range */}
        <div className="pile-card space-y-4">
          <h3 className="font-display text-lg text-foreground">Memorized Portion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">From Page</label>
              <input
                type="number"
                min={1}
                max={layout.totalPages}
                value={settings.memorizedFrom}
                onChange={(e) => setSettings(s => ({ ...s, memorizedFrom: Number(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">To Page</label>
              <input
                type="number"
                min={1}
                max={layout.totalPages}
                value={settings.memorizedTo}
                onChange={(e) => setSettings(s => ({ ...s, memorizedTo: Number(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
              />
            </div>
          </div>
          <p className="text-sm text-accent font-medium">{totalMemorized} pages memorized</p>
        </div>

        {/* Daily Goals */}
        <div className="pile-card space-y-4">
          <h3 className="font-display text-lg text-foreground">Daily Goals</h3>
          
          <div>
            <label className="text-sm font-medium text-foreground">New lesson (Sabbak) pages/day</label>
            <input
              type="number"
              min={0}
              max={5}
              value={settings.dailySabbakPages}
              onChange={(e) => setSettings(s => ({ ...s, dailySabbakPages: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Sabqi lookback (days)</label>
            <input
              type="number"
              min={3}
              max={14}
              value={settings.sabqiDays}
              onChange={(e) => setSettings(s => ({ ...s, sabqiDays: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Revision (Manzil) pages/day</label>
            <input
              type="number"
              min={1}
              max={30}
              value={settings.dailyManzilPages}
              onChange={(e) => setSettings(s => ({ ...s, dailyManzilPages: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-card text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended for monthly completion: {recommendedManzil} pages/day
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            {saved ? '✓ Saved!' : 'Save Settings'}
          </Button>
        </div>

        <div className="pile-card">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h3 className="font-display text-lg text-destructive">Danger Zone</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Reset all data and start fresh.</p>
          <Button variant="destructive" onClick={handleReset}>Reset All Data</Button>
        </div>
      </div>
    </div>
  );
}
