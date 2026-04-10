import { useState } from "react";
import { motion } from "framer-motion";
import type { ConfidenceLevel } from "@/lib/storage";

interface ConfidenceSliderProps {
  page: number;
  onRate: (page: number, confidence: ConfidenceLevel) => void;
  currentConfidence?: ConfidenceLevel | null;
}

const levels: { value: ConfidenceLevel; label: string; emoji: string; arabicLabel: string; selectedClass: string }[] = [
  { value: 'weak', label: 'Weak', emoji: '🔴', arabicLabel: 'ضعيف', selectedClass: 'border-red-500 bg-red-500/10 ring-2 ring-red-500/30' },
  { value: 'medium', label: 'Medium', emoji: '🟡', arabicLabel: 'متوسط', selectedClass: 'border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/30' },
  { value: 'strong', label: 'Strong', emoji: '🟢', arabicLabel: 'قوي', selectedClass: 'border-green-600 bg-green-600/10 ring-2 ring-green-600/30' },
];

export function ConfidenceSlider({ page, onRate, currentConfidence }: ConfidenceSliderProps) {
  const [selected, setSelected] = useState<ConfidenceLevel | null>(currentConfidence || null);

  const handleSelect = (level: ConfidenceLevel) => {
    setSelected(level);
    onRate(page, level);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">How well do you know page {page}?</p>
      <div className="flex gap-2 justify-center">
        {levels.map((level) => (
          <motion.button
            key={level.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(level.value)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              selected === level.value
                ? level.selectedClass
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <span className="text-lg">{level.emoji}</span>
            <span className="text-xs font-medium text-foreground">{level.label}</span>
            <span className="text-[10px] text-muted-foreground font-display">{level.arabicLabel}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
