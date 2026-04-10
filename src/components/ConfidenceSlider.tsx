import { useState } from "react";
import { motion } from "framer-motion";
import type { ConfidenceLevel } from "@/lib/storage";

interface ConfidenceSliderProps {
  page: number;
  onRate: (page: number, confidence: ConfidenceLevel) => void;
  currentConfidence?: ConfidenceLevel | null;
}

const levels: { value: ConfidenceLevel; label: string; emoji: string; arabicLabel: string }[] = [
  { value: 'weak', label: 'Weak', emoji: '🔴', arabicLabel: 'ضعيف' },
  { value: 'medium', label: 'Medium', emoji: '🟡', arabicLabel: 'متوسط' },
  { value: 'strong', label: 'Strong', emoji: '🟢', arabicLabel: 'قوي' },
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
                ? `border-confidence-${level.value} bg-confidence-${level.value}/10`
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
